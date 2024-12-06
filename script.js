document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculateButton');
    const generateMealPlanButton = document.getElementById('generateMealPlanButton');
    const tabs = document.querySelectorAll('.tab-header');

    // Показ и скрытие вкладок
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.nextElementSibling;
            target.classList.toggle('hidden');
        });
    });

    // Калькулятор калорий
    calculateButton.addEventListener('click', () => {
        const gender = document.getElementById('gender').value;
        const age = Number(document.getElementById('age').value);
        const height = Number(document.getElementById('height').value);
        const weight = Number(document.getElementById('weight').value);
        const goalWeight = Number(document.getElementById('goalWeight').value);
        const activityLevel = Number(document.getElementById('activity').value);

        if (!age || !height || !weight || !goalWeight || !activityLevel) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        let bmr;

        // Формулы для расчета базового обмена веществ (BMR)
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Общая калорийность (TDEE) с учетом уровня активности
        const tdee = bmr * activityLevel;

        // В зависимости от цели (похудение, поддержание или набор массы)
        const caloricGoal = tdee + (goalWeight < weight ? -500 : goalWeight > weight ? 500 : 0);

        // Выводим результат
        document.getElementById('result').innerHTML = `
            <p>Ваш базовый обмен веществ (BMR): <b>${bmr.toFixed(0)} ккал</b></p>
            <p>Ваш общий расход калорий (TDEE): <b>${tdee.toFixed(0)} ккал</b></p>
            <p>Для достижения вашей цели с учетом выбранного уровня активности, вам нужно потреблять примерно: <b>${caloricGoal.toFixed(0)} ккал</b></p>
        `;
    });

    // Генерация плана питания
    generateMealPlanButton?.addEventListener('click', () => {
        const calories = Number(document.getElementById('caloriesInput').value);

        if (!calories || calories <= 0) {
            alert('Введите корректное количество калорий!');
            return;
        }

        // Список возможных блюд с калориями
        const meals = [
            { name: 'Овсянка с фруктами', calories: 300 },
            { name: 'Куриное филе с рисом', calories: 500 },
            { name: 'Салат с тунцом', calories: 250 },
            { name: 'Яйца с авокадо', calories: 400 },
            { name: 'Тосты с авокадо и яйцом', calories: 350 },
            { name: 'Киноа с овощами', calories: 450 },
            { name: 'Тунец с овощами', calories: 350 },
            { name: 'Гречка с курицей', calories: 500 },
            { name: 'Творог с медом', calories: 250 },
            { name: 'Фрукты (яблоко, банан)', calories: 150 },
            { name: 'Чечевица с овощами', calories: 400 },
            { name: 'Стейк с картофельным пюре', calories: 600 },
            { name: 'Печеная рыба с картошкой', calories: 550 },
            { name: 'Запеченные овощи с курицей', calories: 450 },
            { name: 'Пудинг из чиа', calories: 250 },
            { name: 'Миндаль и орехи', calories: 200 },
            { name: 'Коктейль из банана и протеина', calories: 300 },
            { name: 'Шоколадный смузи', calories: 350 },
            { name: 'Паста с томатным соусом', calories: 400 },
            { name: 'Тост с авокадо и помидором', calories: 300 },
            { name: 'Запеченная курица с картошкой', calories: 500 },
            { name: 'Молоко с медом', calories: 200 }
        ];

        let remainingCalories = calories;
        const mealPlan = [];
        let totalCalories = 0;

        // Генерация нового плана питания при каждом нажатии
        while (remainingCalories > 0) {
            // Выбираем случайное блюдо
            const randomMeal = meals[Math.floor(Math.random() * meals.length)];

            // Проверяем, если оставшихся калорий достаточно для текущего блюда
            if (remainingCalories - randomMeal.calories >= 0) {
                mealPlan.push(randomMeal);
                totalCalories += randomMeal.calories;
                remainingCalories -= randomMeal.calories;
            }

            // Если оставшиеся калории не могут быть использованы для текущего блюда
            // то мы можем либо добавить небольшое количество калорий (перебор),
            // либо прекратить выбор (недобор не допускается)
            if (remainingCalories < Math.min(...meals.map(meal => meal.calories))) {
                break;
            }
        }

        // Проверяем если остаток калорий положительный, добавляем блюдо с небольшим перебором
        if (remainingCalories > 0) {
            const randomMeal = meals[Math.floor(Math.random() * meals.length)];
            mealPlan.push(randomMeal);
            totalCalories += randomMeal.calories;
            remainingCalories = totalCalories - calories;  // Учёт перебора
        }

        // Сохраняем выбранные блюда в локальное хранилище
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));

        // Выводим результаты
        document.getElementById('mealPlanResult').innerHTML = `Ваш план питания:<br>${mealPlan.map(meal => `<b>${meal.name}</b> (${meal.calories} ккал)`).join('<br>')}<br>Остаток: <b>${remainingCalories} ккал</b>`;
    });
});
