<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LifeAI - AI Life Assistant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-gray-50 dark:bg-gray-950 min-h-screen">
    <!-- Login Screen -->
    <div id="login-screen" class="max-w-md mx-auto p-6 pt-20">
        <div class="text-center mb-10">
            <i class="fas fa-brain text-6xl text-emerald-600"></i>
            <h1 class="text-4xl font-bold mt-4">LifeAI</h1>
            <p class="text-gray-600">Global AI Life Assistant</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow">
            <h2 class="text-2xl font-semibold mb-6 text-center">Welcome</h2>
            <input id="username" type="text" placeholder="Enter your name" class="w-full p-4 rounded-2xl border mb-6">
            <button onclick="login()" class="w-full py-4 bg-emerald-600 text-white rounded-3xl font-medium">Start Using LifeAI</button>
            <p class="text-center text-sm text-gray-500 mt-4">No password needed</p>
        </div>
    </div>

    <!-- App Screen -->
    <div id="app-screen" class="hidden">
        <div class="max-w-2xl mx-auto p-4">
            <header class="bg-emerald-700 p-6 rounded-3xl text-white mb-6">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-brain text-4xl"></i>
                        <div>
                            <h1 class="text-3xl font-bold">LifeAI</h1>
                            <p id="greeting" class="text-emerald-100"></p>
                        </div>
                    </div>
                    <button onclick="logout()" class="px-4 py-2 bg-white/20 rounded-full text-sm">Logout</button>
                </div>
            </header>

            <!-- Your existing app content goes here -->
            <div class="bg-emerald-600 text-white p-6 rounded-3xl mb-8">
                <p id="ai-text" class="italic">"You're making good progress!"</p>
                <button onclick="newInsight()" class="text-sm underline mt-4">New Insight</button>
            </div>

            <button onclick="addTask()" class="w-full py-4 bg-emerald-600 text-white rounded-3xl">+ New Task</button>
        </div>
    </div>

    <script>
        function login() {
            const name = document.getElementById('username').value.trim() || "User";
            localStorage.setItem('lifeai_user', name);
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-screen').classList.remove('hidden');
            document.getElementById('greeting').textContent = `Hi, ${name}!`;
        }

        function logout() {
            if (confirm("Logout?")) {
                localStorage.removeItem('lifeai_user');
                location.reload();
            }
        }

        function newInsight() {
            const insights = ["You're making good progress!", "Consistency wins!", "Small steps matter."];
            document.getElementById("ai-text").textContent = `"${insights[Math.floor(Math.random()*insights.length)]}"`;
        }

        function addTask() {
            const task = prompt("What is your new task?");
            if (task) alert("Task added: " + task + " (full task system coming soon)");
        }

        // Auto-login
        if (localStorage.getItem('lifeai_user')) {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-screen').classList.remove('hidden');
            document.getElementById('greeting').textContent = `Hi, ${localStorage.getItem('lifeai_user')}!`;
        }
    </script>
</body>
</html>
