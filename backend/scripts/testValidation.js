async function runTests() {
  const baseUrl = "http://localhost:5000/api";

  // 1. Login
  const loginRes = await fetch(baseUrl + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@gmail.com", password: "Test@123" }),
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    throw new Error("Login failed: " + JSON.stringify(loginData));
  }
  const token = loginData.accessToken;
  console.log("✓ 1. Login successful for test@gmail.com");

  const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  // 2. Dashboard stats
  const dashRes = await fetch(baseUrl + "/tasks/dashboard", { headers });
  const dashData = await dashRes.json();
  const stats = dashData.stats;
  console.log("✓ 2. Dashboard Stats fetched:", stats);

  if (
    stats.totalTasks !== 20 ||
    stats.pending !== 7 ||
    stats.inProgress !== 6 ||
    stats.completed !== 7
  ) {
    throw new Error(
      "Stats do not match expected 20 (7/6/7): " + JSON.stringify(stats)
    );
  }
  if (
    stats.byPriority.high !== 7 ||
    stats.byPriority.medium !== 8 ||
    stats.byPriority.low !== 5
  ) {
    throw new Error(
      "Priority stats do not match expected (7/8/5): " +
        JSON.stringify(stats.byPriority)
    );
  }
  console.log("   - Status distribution: Pending=7, In Progress=6, Completed=7");
  console.log("   - Priority distribution: High=7, Medium=8, Low=5");

  // 3. Search tests
  const searchTerms = [
    "dashboard",
    "authentication",
    "task",
    "mobile",
    "dark mode",
  ];
  for (const term of searchTerms) {
    const sRes = await fetch(
      baseUrl + "/tasks?search=" + encodeURIComponent(term),
      { headers }
    );
    const sData = await sRes.json();
    console.log(
      `✓ 3. Search for "${term}": found ${sData.tasks.length} matching task(s)`
    );
    if (sData.tasks.length === 0) {
      throw new Error("Search failed for: " + term);
    }
  }

  // 4. Priority filter tests
  for (const p of ["high", "medium", "low"]) {
    const pRes = await fetch(baseUrl + "/tasks?priority=" + p, { headers });
    const pData = await pRes.json();
    console.log(
      `✓ 4. Priority filter "${p}": returned ${pData.tasks.length} tasks`
    );
  }

  // 5. Drag and drop / Status update test
  const allTasksRes = await fetch(baseUrl + "/tasks?limit=50", { headers });
  const allTasks = (await allTasksRes.json()).tasks;
  const pendingTask = allTasks.find((t) => t.status === "pending");

  console.log(`✓ 5. Testing status change on: "${pendingTask.title}"`);
  const moveRes = await fetch(baseUrl + "/tasks/" + pendingTask._id, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status: "in-progress" }),
  });
  const moveData = await moveRes.json();
  if (moveData.task.status !== "in-progress") {
    throw new Error("Failed to update status to in-progress");
  }
  console.log("   - Successfully moved task to in-progress");

  // Revert back to pending
  await fetch(baseUrl + "/tasks/" + pendingTask._id, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status: "pending" }),
  });
  console.log("   - Reverted task back to pending");

  // 6. Test Task Editing
  const editTask = allTasks[0];
  const originalDesc = editTask.description;
  const updateRes = await fetch(baseUrl + "/tasks/" + editTask._id, {
    method: "PUT",
    headers,
    body: JSON.stringify({ description: originalDesc + " [Validated]" }),
  });
  const updateData = await updateRes.json();
  if (!updateData.task.description.includes("[Validated]")) {
    throw new Error("Failed to edit task description");
  }
  console.log(`✓ 6. Task editing tested on "${editTask.title}"`);

  // Revert edit
  await fetch(baseUrl + "/tasks/" + editTask._id, {
    method: "PUT",
    headers,
    body: JSON.stringify({ description: originalDesc }),
  });
  console.log("   - Reverted task description edit to original");

  // 7. Delete Test with a temporary task
  const createRes = await fetch(baseUrl + "/tasks", {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: "Temporary Task for Deletion Testing",
      description: "Testing deletion safety without impacting demo tasks",
      priority: "low",
      status: "pending",
    }),
  });
  const tempTask = (await createRes.json()).task;
  console.log(
    `✓ 7. Created temporary task "${tempTask.title}" (ID: ${tempTask._id})`
  );

  const delRes = await fetch(baseUrl + "/tasks/" + tempTask._id, {
    method: "DELETE",
    headers,
  });
  const delData = await delRes.json();
  if (!delData.success) {
    throw new Error("Failed to delete temporary task");
  }
  console.log("   - Deleted temporary task successfully");

  // 8. Final verification that exactly 20 demo tasks remain
  const finalDash = await (
    await fetch(baseUrl + "/tasks/dashboard", { headers })
  ).json();
  if (finalDash.stats.totalTasks !== 20) {
    throw new Error(
      `Final count mismatch! Expected 20, got ${finalDash.stats.totalTasks}`
    );
  }
  console.log(
    "✓ 8. Final verification: exactly 20 demo tasks preserved in database"
  );

  console.log("\n==================================================");
  console.log("ALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS!");
  console.log("==================================================");
}

runTests().catch((e) => {
  console.error("\nTEST ERROR:", e.message);
  process.exit(1);
});
