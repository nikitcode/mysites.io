document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculateButton');
    const generateMealPlanButton = document.getElementById('generateMealPlanButton');
    const tabs = document.querySelectorAll('.tab-header');
    const loadingGif = document.getElementById('loadingGif');
    const mealPlanResult = document.getElementById('mealPlanResult');

    // Показ и скрытие вкладок
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.nextElementSibling;
            target.classList.toggle('hidden');
        });
    });

    calculateButton?.addEventListener('click', () => {
        const gender = document.getElementById("gender").value;
        const age = Number(document.getElementById("age").value);
        const height = Number(document.getElementById("height").value);
        const weight = Number(document.getElementById("weight").value);
        const goalWeight = Number(document.getElementById("goalWeight").value);
        const activity = Number(document.getElementById("activity").value);

        if (!age || !height || !weight || !goalWeight) {
            alert("Заполните все поля!");
            return;
        }

        let bmr;
        if (gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const maintenanceCalories = bmr * activity;
        const goalCalories = maintenanceCalories + (goalWeight - weight) * 7700 / 30;

        document.getElementById("result").innerHTML = `
            Ваша ежедневная норма калорий: <b>${Math.round(maintenanceCalories)} ккал</b><br>
            Для достижения цели: <b>${Math.round(goalCalories)} ккал</b>
        `;
    });

    generateMealPlanButton?.addEventListener('click', () => {
        // Скрываем гифку и показываем область для плана питания
        loadingGif.style.display = 'none';
        mealPlanResult.style.display = 'block';

        const calories = Number(document.getElementById('caloriesInput').value);

        if (!calories || calories <= 0) {
            alert('Введите корректное количество калорий!');
            return;
        }

        const meals = [
            { name: 'Овсянка с фруктами', calories: 300 },
            { name: 'Куриное филе с рисом', calories: 500 },
            { name: 'Салат с тунцом', calories: 250 },
        ];

        let remainingCalories = calories;
        const mealPlan = [];

        for (const meal of meals) {
            if (remainingCalories - meal.calories >= 0) {
                mealPlan.push(meal);
                remainingCalories -= meal.calories;
            }
        }

        mealPlanResult.innerHTML = `
            Ваш план питания:<br>
            ${mealPlan.map(meal => `<b>${meal.name}</b> (${meal.calories} ккал)`).join('<br>')}<br>
            Остаток: <b>${remainingCalories} ккал</b>
        `;
    });
});
