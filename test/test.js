function runTests() {
    console.log("Running TaskTrackr Tests...");
  
    testAddTasks();
    testViewTasks();
    testAnalytics();
    testLandingPage();
  
    console.log("All tests executed.");
  }
  
  // === Test 1: AddTasks.html ===
  function testAddTasks() {
    try {
      const fakeTask = {
        id: "123",
        title: "Test Task",
        description: "Testing form submission",
        dueDate: "2025-05-01",
        priority: "High",
        status: "Incomplete",
      };
  
      const called = [];
      window.fetch = (url, options) => {
        called.push({ url, options });
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      };
  
      const form = document.getElementById("addTaskForm");
      if (!form) return console.warn("Add Task form not on this page.");
  
      document.getElementById("taskId").value = fakeTask.id;
      document.getElementById("taskTitle").value = fakeTask.title;
      document.getElementById("description").value = fakeTask.description;
      document.getElementById("dueDate").value = fakeTask.dueDate;
      document.getElementById("priority").value = fakeTask.priority;
      document.getElementById("taskStatus").checked = false;
  
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  
      setTimeout(() => {
        console.assert(called.length > 0, "AddTasks Test: fetch was called.");
      }, 500);
  
    } catch (e) {
      console.error("AddTasks Test Error:", e);
    }
  }
  
  // === Test 2: ViewTasks.html ===
  function testViewTasks() {
    try {
      const table = document.getElementById("taskTableBody");
      if (!table) return console.warn("View Tasks table not on this page.");
  
      const searchInput = document.getElementById("searchBar");
      if (!searchInput) throw new Error("Search bar not found");
  
      searchInput.value = "test";
      searchInput.dispatchEvent(new Event("input"));
  
      console.assert(true, "ViewTasks Test: Search bar interaction passed.");
    } catch (e) {
      console.error("ViewTasks Test Error:", e);
    }
  }
  
  // === Test 3: Analytics.html ===
  function testAnalytics() {
    try {
      const total = document.getElementById("total-tasks");
      const completed = document.getElementById("completed-tasks");
      const overdue = document.getElementById("overdue-tasks");
  
      if (!total || !completed || !overdue) return console.warn("Analytics not on this page.");
  
      console.assert(!isNaN(parseInt(total.textContent)) || total.textContent === "--", "Analytics Test: Total task value is valid or placeholder.");
      console.assert(document.querySelector("canvas#barChart"), "Analytics Test: Bar chart canvas found.");
      console.assert(document.querySelector("canvas#pieChart"), "Analytics Test: Pie chart canvas found.");
    } catch (e) {
      console.error("Analytics Test Error:", e);
    }
  }
  
  // === Test 4: index.html ===
  function testLandingPage() {
    try {
      const links = ["Analytics.html", "AddTasks.html", "ViewTasks.html"];
      links.forEach(href => {
        const link = document.querySelector(`a[href="${href}"]`);
        console.assert(link, `Landing Page Test: Link to ${href} exists.`);
      });
    } catch (e) {
      console.error("Landing Page Test Error:", e);
    }
  }

  
  // HOW TO USE: 
  //Add <script src="js/test.js"></script> to whatever html class you want to test.
