// ============================================================================
// CodeAcademy — учебная программа.
// Каждый урок: explanation (объяснение) → example (пример) → exercise (практика).
// runtime определяет, как выполняется/проверяется код практики:
//   'pyodide' — настоящий Python в браузере
//   'js'      — настоящий JavaScript (нативный eval)
//   'html'    — рендер в iframe + проверка DOM
//   'sim'     — Java/C++: нет компилятора в браузере, проверка по структуре кода
// ============================================================================

function balancedBraces(code, open, close){
  let depth = 0;
  for (const ch of code){
    if (ch === open) depth++;
    if (ch === close) depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

window.CURRICULUM = {

  python: {
    name: 'Python', emoji: '🐍', runtime: 'pyodide',
    desc: 'Настоящее выполнение кода в браузере (Pyodide) — от переменных до функций.',
    lessons: [
      {
        day: 1, title: 'Переменные и типы данных',
        explanation:
`Переменная — это "коробка" с именем, в которую можно положить значение.

В Python не нужно заранее объявлять тип — он определяется автоматически:
  age = 18          → это int (целое число)
  name = "Аня"      → это str (строка текста)
  height = 1.65     → это float (дробное число)
  is_student = True → это bool (логическое значение: True/False)

Чтобы вывести значение на экран, используется функция print().
Несколько значений через запятую в print() выводятся через пробел.`,
        example: `age = 18\nname = "Аня"\nprint("Имя:", name, "Возраст:", age)`,
        exercisePrompt: 'Создай переменную name со своим именем и переменную age со своим возрастом (числом). Выведи их через print в формате: Имя: ... Возраст: ...',
        starter: `name = \nage = \nprint("Имя:", name, "Возраст:", age)`,
        solution: `name = "Максим"\nage = 20\nprint("Имя:", name, "Возраст:", age)`,
        checkOutput(out){
          if (!/Имя:\s*\S+.*Возраст:\s*\d+/.test(out)) {
            if (!out.includes('Имя:')) return {pass:false, hint:'В выводе должно быть слово "Имя:" — проверь, что print() выглядит как в примере.'};
            if (!/Возраст:\s*\d+/.test(out)) return {pass:false, hint:'Возраст должен быть числом (без кавычек), например age = 20, а не age = "20".'};
            return {pass:false, hint:'Формат вывода не совпадает с примером. Скопируй структуру print() из примера и подставь свои значения.'};
          }
          return {pass:true};
        }
      },
      {
        day: 2, title: 'Условия: if / elif / else',
        explanation:
`Условия позволяют программе принимать решения.

if условие:
    код, если условие верно
elif другое_условие:
    код, если верно оно
else:
    код, если ничего не подошло

Важно: после if/elif/else обязательно двоеточие ":", а строки внутри
блока должны быть с отступом (обычно 4 пробела). Python определяет
границы блока именно по отступам, а не по скобкам {}.

Операторы сравнения: == (равно), != (не равно), >, <, >=, <=`,
        example: `age = 20\nif age >= 18:\n    print("Совершеннолетний")\nelse:\n    print("Несовершеннолетний")`,
        exercisePrompt: 'Создай переменную score с числом от 0 до 100. Если score >= 60 — выведи "Сдал", иначе выведи "Не сдал".',
        starter: `score = \nif score >= 60:\n    print("Сдал")\nelse:\n    print("Не сдал")`,
        solution: `score = 75\nif score >= 60:\n    print("Сдал")\nelse:\n    print("Не сдал")`,
        checkOutput(out){
          if (out.trim() === 'Сдал' || out.trim() === 'Не сдал') return {pass:true};
          if (out.trim() === '') return {pass:false, hint:'Программа ничего не вывела — проверь отступы: строки внутри if/else должны начинаться с 4 пробелов.'};
          return {pass:false, hint:'Ожидался вывод ровно "Сдал" или "Не сдал", без лишнего текста.'};
        }
      },
      {
        day: 3, title: 'Циклы: for и while',
        explanation:
`Цикл for перебирает элементы последовательности:
  for i in range(5):
      print(i)         # выведет 0 1 2 3 4

range(5) — это числа от 0 до 4 (5 не включается).
range(2, 6) — числа от 2 до 5.

Цикл while повторяется, пока условие истинно:
  i = 0
  while i < 3:
      print(i)
      i += 1           # обязательно менять переменную, иначе цикл бесконечный`,
        example: `for i in range(5):\n    print("Число:", i)`,
        exercisePrompt: 'С помощью цикла for и range() выведи числа от 1 до 5 (каждое на новой строке через print).',
        starter: `for i in range(1, 6):\n    print(i)`,
        solution: `for i in range(1, 6):\n    print(i)`,
        checkOutput(out){
          const nums = out.trim().split('\n').map(s => s.trim());
          const expected = ['1','2','3','4','5'];
          if (JSON.stringify(nums) === JSON.stringify(expected)) return {pass:true};
          if (nums.length === 0 || out.trim()==='') return {pass:false, hint:'Ничего не выведено. Проверь отступ у print(i) — он должен быть внутри цикла.'};
          return {pass:false, hint:'Ожидались числа от 1 до 5, каждое на новой строке. Проверь границы range() — range(1, 6) даёт 1,2,3,4,5.'};
        }
      },
      {
        day: 4, title: 'Списки (list)',
        explanation:
`Список — упорядоченная коллекция значений:
  fruits = ["яблоко", "банан", "вишня"]

Обращение по индексу (с нуля): fruits[0] → "яблоко"
Добавить элемент: fruits.append("груша")
Длина списка: len(fruits)
Перебор в цикле:
  for fruit in fruits:
      print(fruit)`,
        example: `fruits = ["яблоко", "банан"]\nfruits.append("вишня")\nfor f in fruits:\n    print(f)`,
        exercisePrompt: 'Создай список numbers с любыми тремя числами. Выведи их сумму через print (используй sum(numbers)).',
        starter: `numbers = [1, 2, 3]\nprint(sum(numbers))`,
        solution: `numbers = [4, 10, 6]\nprint(sum(numbers))`,
        checkOutput(out, code){
          if (!/numbers\s*=\s*\[/.test(code)) return {pass:false, hint:'Нужно создать именно список numbers = [...].'};
          const n = parseFloat(out.trim());
          if (isNaN(n)) return {pass:false, hint:'На выходе должно быть число — сумма элементов списка.'};
          return {pass:true};
        }
      },
      {
        day: 5, title: 'Функции (def)',
        explanation:
`Функция — именованный блок кода, который можно вызывать многократно.

def greet(name):
    return "Привет, " + name

result = greet("Аня")
print(result)      # Привет, Аня

return передаёт значение обратно туда, откуда функция была вызвана.
Без return функция возвращает None.`,
        example: `def square(x):\n    return x * x\n\nprint(square(5))`,
        exercisePrompt: 'Напиши функцию add(a, b), которая возвращает сумму двух чисел. Вызови её с любыми двумя числами и выведи результат через print.',
        starter: `def add(a, b):\n    return a + b\n\nprint(add(2, 3))`,
        solution: `def add(a, b):\n    return a + b\n\nprint(add(10, 15))`,
        checkOutput(out, code){
          if (!/def\s+add\s*\(/.test(code)) return {pass:false, hint:'Функция должна называться именно add и принимать два параметра: def add(a, b):'};
          if (!/return/.test(code)) return {pass:false, hint:'Функция должна возвращать значение через return, а не просто print внутри функции.'};
          const n = parseFloat(out.trim());
          if (isNaN(n)) return {pass:false, hint:'На выходе ожидается число — результат сложения.'};
          return {pass:true};
        }
      },
      {
        day: 6, title: 'Словари (dict)',
        explanation:
`Словарь хранит пары "ключ: значение" — быстрый поиск по ключу вместо
перебора по индексу, как в списке:

  person = {"name": "Аня", "age": 20}
  print(person["name"])       # Аня
  person["city"] = "Москва"   # добавить новый ключ

Перебор:
  for key, value in person.items():
      print(key, value)

.get("ключ") — безопасное чтение (вернёт None, если ключа нет,
вместо ошибки, как при person["несуществующий"]).`,
        example: `person = {"name": "Аня", "age": 20}\nfor key, value in person.items():\n    print(key, value)`,
        exercisePrompt: 'Создай словарь student с ключами "name" и "grade". Выведи оба значения через print в формате: name: ... grade: ...',
        starter: `student = {"name": "Иван", "grade": 5}\nprint("name:", student["name"], "grade:", student["grade"])`,
        solution: `student = {"name": "Иван", "grade": 5}\nprint("name:", student["name"], "grade:", student["grade"])`,
        checkOutput(out, code){
          if (!/\{.*:.*\}/.test(code)) return {pass:false, hint:'Нужен словарь в фигурных скобках: student = {"name": ..., "grade": ...}'};
          if (!/name:/.test(out) || !/grade:/.test(out)) return {pass:false, hint:'В выводе должны быть и "name:", и "grade:".'};
          return {pass:true};
        }
      },
      {
        day: 7, title: 'Классы и объекты (ООП)',
        explanation:
`Класс — "чертёж" для создания объектов со своими данными и поведением:

  class Dog:
      def __init__(self, name):
          self.name = name          # self — ссылка на конкретный объект

      def bark(self):
          return self.name + " говорит: Гав!"

  rex = Dog("Рекс")        # создаём объект (экземпляр класса)
  print(rex.bark())        # Рекс говорит: Гав!

__init__ — конструктор, вызывается автоматически при создании объекта.
self всегда первый параметр метода — это и есть "текущий объект".`,
        example: `class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return self.name + " говорит: Гав!"\n\nrex = Dog("Рекс")\nprint(rex.bark())`,
        exercisePrompt: 'Создай класс Cat с __init__(self, name) и методом meow(self), возвращающим "{name} говорит: Мяу!". Создай объект и выведи результат meow().',
        starter: `class Cat:\n    def __init__(self, name):\n        self.name = name\n    def meow(self):\n        return self.name + " говорит: Мяу!"\n\ncat = Cat("Мурка")\nprint(cat.meow())`,
        solution: `class Cat:\n    def __init__(self, name):\n        self.name = name\n    def meow(self):\n        return self.name + " говорит: Мяу!"\n\ncat = Cat("Мурка")\nprint(cat.meow())`,
        checkOutput(out, code){
          if (!/class\s+Cat/.test(code)) return {pass:false, hint:'Нужен класс с именем Cat: class Cat:'};
          if (!/def\s+__init__\s*\(self/.test(code)) return {pass:false, hint:'Нужен конструктор __init__(self, name) для сохранения имени.'};
          if (!/def\s+meow\s*\(self/.test(code)) return {pass:false, hint:'Нужен метод meow(self), возвращающий фразу с self.name.'};
          if (!/говорит: Мяу!/.test(out)) return {pass:false, hint:'Вывод должен содержать "говорит: Мяу!" — проверь текст в методе meow.'};
          return {pass:true};
        }
      },
      {
        day: 8, title: 'Обработка ошибок (try/except)',
        explanation:
`Если код может упасть с ошибкой (например, деление на 0 или
преобразование текста в число), это можно перехватить:

  try:
      result = 10 / 0
  except ZeroDivisionError:
      print("Нельзя делить на ноль")

Общий перехват любой ошибки: except Exception as e: print(e)
Программа не "падает" — вместо этого выполняется код в except.
Это ключевой навык для написания надёжных программ уровня pro.`,
        example: `try:\n    x = int("не число")\nexcept ValueError:\n    print("Это не число!")`,
        exercisePrompt: 'Напиши try/except, который пытается сделать 10 / 0 и в except ZeroDivisionError выводит "Деление на ноль запрещено".',
        starter: `try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Деление на ноль запрещено")`,
        solution: `try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Деление на ноль запрещено")`,
        checkOutput(out, code){
          if (!/try\s*:/.test(code)) return {pass:false, hint:'Нужен блок try:'};
          if (!/except/.test(code)) return {pass:false, hint:'Нужен блок except для перехвата ошибки.'};
          if (out.trim() !== 'Деление на ноль запрещено') return {pass:false, hint:'Ожидался вывод ровно "Деление на ноль запрещено".'};
          return {pass:true};
        }
      }
    ]
  },

  javascript: {
    name: 'JavaScript', emoji: '🟨', runtime: 'js',
    desc: 'Язык веб-страниц. Код выполняется по-настоящему прямо в браузере.',
    lessons: [
      {
        day: 1, title: 'Переменные и вывод',
        explanation:
`В JavaScript переменные объявляются через let (можно менять) или
const (нельзя менять после создания).

  let age = 18;
  const name = "Аня";

Вывод в консоль: console.log(значение1, значение2, ...)
Каждая инструкция обычно заканчивается точкой с запятой ";".`,
        example: `let age = 18;\nconst name = "Аня";\nconsole.log("Имя:", name, "Возраст:", age);`,
        exercisePrompt: 'Создай const name со своим именем и let age со своим возрастом. Выведи через console.log в формате: Имя: ... Возраст: ...',
        starter: `const name = "";\nlet age = 0;\nconsole.log("Имя:", name, "Возраст:", age);`,
        solution: `const name = "Максим";\nlet age = 20;\nconsole.log("Имя:", name, "Возраст:", age);`,
        checkOutput(out){
          if (!out.includes('Имя:')) return {pass:false, hint:'В выводе должно быть "Имя:" — не меняй текстовые части console.log.'};
          if (!/Возраст:\s*\d+/.test(out)) return {pass:false, hint:'Возраст должен быть числом, например let age = 20; (без кавычек).'};
          return {pass:true};
        }
      },
      {
        day: 2, title: 'Условия: if / else if / else',
        explanation:
`if (условие) {
    // если верно
} else if (другое условие) {
    // если верно оно
} else {
    // если ничего не подошло
}

Операторы сравнения: === (строго равно), !== , >, <, >=, <=
Используй именно === , а не =, чтобы не перепутать сравнение с присваиванием.`,
        example: `let age = 20;\nif (age >= 18) {\n  console.log("Совершеннолетний");\n} else {\n  console.log("Несовершеннолетний");\n}`,
        exercisePrompt: 'Создай let score с числом от 0 до 100. Если score >= 60 — выведи "Сдал", иначе "Не сдал".',
        starter: `let score = 75;\nif (score >= 60) {\n  console.log("Сдал");\n} else {\n  console.log("Не сдал");\n}`,
        solution: `let score = 75;\nif (score >= 60) {\n  console.log("Сдал");\n} else {\n  console.log("Не сдал");\n}`,
        checkOutput(out){
          if (out.trim() === 'Сдал' || out.trim() === 'Не сдал') return {pass:true};
          return {pass:false, hint:'Ожидался ровно один вывод: "Сдал" или "Не сдал". Проверь фигурные скобки { } у if/else.'};
        }
      },
      {
        day: 3, title: 'Циклы: for',
        explanation:
`for (let i = 0; i < 5; i++) {
    console.log(i);
}

Три части в скобках: начальное значение; условие продолжения; шаг.
i++ означает "увеличить i на 1" — короткая запись i = i + 1.`,
        example: `for (let i = 0; i < 5; i++) {\n  console.log("Число:", i);\n}`,
        exercisePrompt: 'С помощью цикла for выведи числа от 1 до 5 (каждое отдельным console.log).',
        starter: `for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}`,
        solution: `for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}`,
        checkOutput(out){
          const nums = out.trim().split('\n').map(s => s.trim());
          const expected = ['1','2','3','4','5'];
          if (JSON.stringify(nums) === JSON.stringify(expected)) return {pass:true};
          return {pass:false, hint:'Ожидались числа от 1 до 5, каждое на новой строке. Проверь условие i <= 5 и шаг i++.'};
        }
      },
      {
        day: 4, title: 'Массивы (array)',
        explanation:
`const fruits = ["яблоко", "банан", "вишня"];

Обращение по индексу (с нуля): fruits[0] → "яблоко"
Добавить элемент: fruits.push("груша")
Длина массива: fruits.length
Сумма чисел массива: array.reduce((a, b) => a + b, 0)`,
        example: `const fruits = ["яблоко", "банан"];\nfruits.push("вишня");\nfruits.forEach(f => console.log(f));`,
        exercisePrompt: 'Создай массив numbers из трёх чисел. Выведи их сумму через console.log (используй reduce).',
        starter: `const numbers = [1, 2, 3];\nconsole.log(numbers.reduce((a, b) => a + b, 0));`,
        solution: `const numbers = [4, 10, 6];\nconsole.log(numbers.reduce((a, b) => a + b, 0));`,
        checkOutput(out, code){
          if (!/numbers\s*=\s*\[/.test(code)) return {pass:false, hint:'Нужен именно массив numbers = [...].'};
          const n = parseFloat(out.trim());
          if (isNaN(n)) return {pass:false, hint:'На выходе должно быть число — сумма элементов массива.'};
          return {pass:true};
        }
      },
      {
        day: 5, title: 'Функции',
        explanation:
`Обычная функция:
  function add(a, b) {
      return a + b;
  }

Стрелочная функция (короткая запись):
  const add = (a, b) => a + b;

Вызов: add(2, 3) → 5`,
        example: `function square(x) {\n  return x * x;\n}\nconsole.log(square(5));`,
        exercisePrompt: 'Напиши функцию add(a, b) (обычную или стрелочную), возвращающую сумму. Вызови её и выведи результат через console.log.',
        starter: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));`,
        solution: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(10, 15));`,
        checkOutput(out, code){
          if (!/add\s*=|function\s+add/.test(code)) return {pass:false, hint:'Функция должна называться именно add.'};
          if (!/return/.test(code)) return {pass:false, hint:'Функция должна возвращать значение через return.'};
          const n = parseFloat(out.trim());
          if (isNaN(n)) return {pass:false, hint:'На выходе ожидается число — результат сложения.'};
          return {pass:true};
        }
      },
      {
        day: 6, title: 'Объекты',
        explanation:
`Объект хранит пары "ключ: значение":

  const person = { name: "Аня", age: 20 };
  console.log(person.name);      // Аня (через точку)
  console.log(person["age"]);    // 20 (через квадратные скобки)
  person.city = "Москва";        // добавить новое свойство

Перебор всех ключей:
  for (const key in person) {
      console.log(key, person[key]);
  }`,
        example: `const person = { name: "Аня", age: 20 };\nconsole.log(person.name, person.age);`,
        exercisePrompt: 'Создай объект student с полями name и grade. Выведи оба значения через console.log в формате: name: ... grade: ...',
        starter: `const student = { name: "Иван", grade: 5 };\nconsole.log("name:", student.name, "grade:", student.grade);`,
        solution: `const student = { name: "Иван", grade: 5 };\nconsole.log("name:", student.name, "grade:", student.grade);`,
        checkOutput(out, code){
          if (!/\{[^}]*:/.test(code)) return {pass:false, hint:'Нужен объект в фигурных скобках: const student = { name: ..., grade: ... };'};
          if (!/name:/.test(out) || !/grade:/.test(out)) return {pass:false, hint:'В выводе должны быть и "name:", и "grade:".'};
          return {pass:true};
        }
      },
      {
        day: 7, title: 'Классы (ООП)',
        explanation:
`class Dog {
    constructor(name) {
        this.name = name;      // this — ссылка на текущий объект
    }
    bark() {
        return this.name + " говорит: Гав!";
    }
}

const rex = new Dog("Рекс");    // new создаёт объект (экземпляр)
console.log(rex.bark());        // Рекс говорит: Гав!

constructor вызывается автоматически при создании через new.`,
        example: `class Dog {\n  constructor(name) {\n    this.name = name;\n  }\n  bark() {\n    return this.name + " говорит: Гав!";\n  }\n}\nconst rex = new Dog("Рекс");\nconsole.log(rex.bark());`,
        exercisePrompt: 'Создай класс Cat с constructor(name) и методом meow(), возвращающим "{name} говорит: Мяу!". Создай объект через new и выведи результат.',
        starter: `class Cat {\n  constructor(name) {\n    this.name = name;\n  }\n  meow() {\n    return this.name + " говорит: Мяу!";\n  }\n}\nconst cat = new Cat("Мурка");\nconsole.log(cat.meow());`,
        solution: `class Cat {\n  constructor(name) {\n    this.name = name;\n  }\n  meow() {\n    return this.name + " говорит: Мяу!";\n  }\n}\nconst cat = new Cat("Мурка");\nconsole.log(cat.meow());`,
        checkOutput(out, code){
          if (!/class\s+Cat/.test(code)) return {pass:false, hint:'Нужен класс с именем Cat: class Cat { ... }'};
          if (!/constructor\s*\(/.test(code)) return {pass:false, hint:'Нужен constructor(name) для сохранения имени в this.name.'};
          if (!/new\s+Cat/.test(code)) return {pass:false, hint:'Объект нужно создать через new Cat("...")'};
          if (!/говорит: Мяу!/.test(out)) return {pass:false, hint:'Вывод должен содержать "говорит: Мяу!".'};
          return {pass:true};
        }
      },
      {
        day: 8, title: 'Работа с DOM',
        explanation:
`DOM — это структура HTML-страницы, доступная из JavaScript.

  document.querySelector("h1")          — найти первый элемент по селектору
  document.querySelector("h1").textContent = "Новый текст"  — изменить текст
  document.createElement("div")          — создать новый элемент

В этом уроке нет реальной страницы для изменения — но именно так
JavaScript "оживляет" HTML в настоящих сайтах: находит элементы и
меняет их содержимое или стили в ответ на действия пользователя.
Здесь потренируемся на объекте-заглушке document, который эмулирует поведение.`,
        example: `const el = { textContent: "" };\nel.textContent = "Привет!";\nconsole.log(el.textContent);`,
        exercisePrompt: 'Создай объект el = { textContent: "" }, присвой el.textContent = "Готово" и выведи el.textContent через console.log.',
        starter: `const el = { textContent: "" };\nel.textContent = "Готово";\nconsole.log(el.textContent);`,
        solution: `const el = { textContent: "" };\nel.textContent = "Готово";\nconsole.log(el.textContent);`,
        checkOutput(out, code){
          if (!/textContent\s*=/.test(code)) return {pass:false, hint:'Нужно присвоить el.textContent = "...";'};
          if (out.trim() !== 'Готово') return {pass:false, hint:'Ожидался вывод ровно "Готово" — то же значение, что ты присвоил textContent.'};
          return {pass:true};
        }
      }
    ]
  },

  html: {
    name: 'HTML/CSS', emoji: '🌐', runtime: 'html',
    desc: 'Настоящий рендер страницы прямо в приложении — видишь результат сразу.',
    lessons: [
      {
        day: 1, title: 'Структура документа и теги',
        explanation:
`HTML-документ строится из тегов — они описывают структуру страницы:
  <h1>Заголовок</h1>
  <p>Обычный текст (параграф)</p>

Теги обычно парные: <p>...</p>. Всё, что внутри — содержимое тега.
<h1> — самый крупный заголовок, есть ещё <h2>, <h3> и т.д.`,
        example: `<h1>Привет, мир!</h1>\n<p>Это мой первый абзац.</p>`,
        exercisePrompt: 'Создай заголовок <h1> с любым текстом и один абзац <p> под ним.',
        starter: `<h1>Заголовок</h1>\n<p>Текст абзаца</p>`,
        solution: `<h1>Моя страница</h1>\n<p>Здесь я учу HTML.</p>`,
        checkDom(doc){
          const h1 = doc.querySelector('h1');
          const p = doc.querySelector('p');
          if (!h1) return {pass:false, hint:'Не найден тег <h1> — добавь заголовок.'};
          if (!p) return {pass:false, hint:'Не найден тег <p> — добавь абзац текста.'};
          if (!h1.textContent.trim()) return {pass:false, hint:'<h1> пустой — впиши внутрь него текст.'};
          return {pass:true};
        }
      },
      {
        day: 2, title: 'Списки', 
        explanation:
`Маркированный список (точки):
  <ul>
    <li>Пункт 1</li>
    <li>Пункт 2</li>
  </ul>

Нумерованный список — тот же принцип, но тег <ol> вместо <ul>.
<li> — каждый отдельный пункт списка, обязательно внутри <ul> или <ol>.`,
        example: `<ul>\n  <li>Молоко</li>\n  <li>Хлеб</li>\n</ul>`,
        exercisePrompt: 'Создай маркированный список <ul> минимум с тремя пунктами <li>.',
        starter: `<ul>\n  <li>Пункт 1</li>\n</ul>`,
        solution: `<ul>\n  <li>Яблоки</li>\n  <li>Бананы</li>\n  <li>Вишня</li>\n</ul>`,
        checkDom(doc){
          const items = doc.querySelectorAll('ul li');
          if (items.length < 3) return {pass:false, hint:`Нужно минимум 3 пункта <li> внутри <ul>, сейчас найдено: ${items.length}.`};
          return {pass:true};
        }
      },
      {
        day: 3, title: 'Ссылки и изображения',
        explanation:
`Ссылка:
  <a href="https://example.com">Текст ссылки</a>
href — атрибут с адресом, куда ведёт ссылка.

Изображение:
  <img src="картинка.jpg" alt="описание">
src — путь к файлу, alt — текст на случай если картинка не загрузится
(и для незрячих пользователей с экранными читалками — это важно).`,
        example: `<a href="https://t.me">Открыть Telegram</a>`,
        exercisePrompt: 'Создай ссылку <a> с атрибутом href на любой сайт и текстом внутри.',
        starter: `<a href="https://example.com">Ссылка</a>`,
        solution: `<a href="https://example.com">Перейти на сайт</a>`,
        checkDom(doc){
          const a = doc.querySelector('a');
          if (!a) return {pass:false, hint:'Не найден тег <a> — добавь ссылку.'};
          if (!a.getAttribute('href')) return {pass:false, hint:'У ссылки должен быть атрибут href="...".'};
          if (!a.textContent.trim()) return {pass:false, hint:'Внутри <a> должен быть текст ссылки.'};
          return {pass:true};
        }
      },
      {
        day: 4, title: 'CSS: селекторы и цвет',
        explanation:
`CSS оформляет то, что описано в HTML. Стили можно писать прямо в
теге <style>:

  <style>
    h1 { color: teal; }
    p { font-size: 18px; }
  </style>
  <h1>Заголовок</h1>

Селектор (h1, p, .класс, #id) указывает, к чему применяется стиль.
Свойства пишутся внутри { } через точку с запятой.`,
        example: `<style>\n  h1 { color: teal; }\n</style>\n<h1>Цветной заголовок</h1>`,
        exercisePrompt: 'В теге <style> задай h1 { color: любой_цвет; }, и добавь сам <h1>.',
        starter: `<style>\n  h1 { color: red; }\n</style>\n<h1>Текст</h1>`,
        solution: `<style>\n  h1 { color: teal; }\n</style>\n<h1>Крашеный заголовок</h1>`,
        checkDom(doc){
          const h1 = doc.querySelector('h1');
          if (!h1) return {pass:false, hint:'Нужен тег <h1>.'};
          const color = doc.defaultView.getComputedStyle(h1).color;
          if (color === 'rgb(0, 0, 0)' || !color) return {pass:false, hint:'Цвет заголовка не изменился — проверь селектор h1 { color: ...; } внутри <style>.'};
          return {pass:true};
        }
      },
      {
        day: 5, title: 'Flexbox: простая раскладка',
        explanation:
`Flexbox — способ расположить элементы в ряд или столбец без сложных
вычислений отступов.

  <style>
    .row { display: flex; gap: 10px; }
  </style>
  <div class="row">
    <div>Блок 1</div>
    <div>Блок 2</div>
  </div>

display: flex превращает контейнер в "гибкий" — его прямые дети
выстраиваются в ряд автоматически. gap задаёт промежуток между ними.`,
        example: `<style>\n  .row { display: flex; gap: 10px; }\n  .row div { background: #ddd; padding: 10px; }\n</style>\n<div class="row">\n  <div>1</div>\n  <div>2</div>\n</div>`,
        exercisePrompt: 'Создай <div class="row"> с display: flex и минимум двумя дочерними <div> внутри.',
        starter: `<style>\n  .row { display: flex; }\n</style>\n<div class="row">\n  <div>Блок 1</div>\n  <div>Блок 2</div>\n</div>`,
        solution: `<style>\n  .row { display: flex; gap: 12px; }\n</style>\n<div class="row">\n  <div>Блок 1</div>\n  <div>Блок 2</div>\n</div>`,
        checkDom(doc){
          const row = doc.querySelector('.row');
          if (!row) return {pass:false, hint:'Не найден элемент с class="row".'};
          const display = doc.defaultView.getComputedStyle(row).display;
          if (display !== 'flex') return {pass:false, hint:'.row должен иметь display: flex в <style>.'};
          if (row.children.length < 2) return {pass:false, hint:'Внутри .row должно быть минимум 2 дочерних <div>.'};
          return {pass:true};
        }
      },
      {
        day: 6, title: 'Формы',
        explanation:
`Форма собирает ввод пользователя:

  <form>
    <input type="text" placeholder="Имя">
    <input type="email" placeholder="Email">
    <button type="submit">Отправить</button>
  </form>

type="text" — обычное поле, type="email" — с проверкой формата email,
placeholder — подсказка внутри пустого поля (не значение!).
<button type="submit"> — кнопка отправки формы.`,
        example: `<form>\n  <input type="text" placeholder="Имя">\n  <button type="submit">Отправить</button>\n</form>`,
        exercisePrompt: 'Создай <form> с минимум одним <input> и кнопкой <button type="submit">.',
        starter: `<form>\n  <input type="text" placeholder="Имя">\n  <button type="submit">Отправить</button>\n</form>`,
        solution: `<form>\n  <input type="text" placeholder="Имя">\n  <input type="email" placeholder="Email">\n  <button type="submit">Отправить</button>\n</form>`,
        checkDom(doc){
          const form = doc.querySelector('form');
          if (!form) return {pass:false, hint:'Не найден тег <form>.'};
          if (!form.querySelector('input')) return {pass:false, hint:'Внутри <form> должен быть хотя бы один <input>.'};
          const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
          if (!btn) return {pass:false, hint:'Нужна кнопка <button type="submit">.'};
          return {pass:true};
        }
      },
      {
        day: 7, title: 'CSS Grid',
        explanation:
`Grid — раскладка по сетке (в отличие от flex, который в одну линию):

  <style>
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  </style>
  <div class="grid">
    <div>1</div><div>2</div><div>3</div>
  </div>

grid-template-columns: 1fr 1fr 1fr — три равные колонки.
1fr означает "одна доля свободного пространства" — гибкая единица Grid.`,
        example: `<style>\n  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\n</style>\n<div class="grid">\n  <div>A</div>\n  <div>B</div>\n</div>`,
        exercisePrompt: 'Создай <div class="grid"> с display: grid, grid-template-columns на 3 колонки, и минимум тремя дочерними <div>.',
        starter: `<style>\n  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }\n</style>\n<div class="grid">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>`,
        solution: `<style>\n  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }\n</style>\n<div class="grid">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>`,
        checkDom(doc){
          const grid = doc.querySelector('.grid');
          if (!grid) return {pass:false, hint:'Не найден элемент с class="grid".'};
          const display = doc.defaultView.getComputedStyle(grid).display;
          if (display !== 'grid') return {pass:false, hint:'.grid должен иметь display: grid.'};
          if (grid.children.length < 3) return {pass:false, hint:'Внутри .grid должно быть минимум 3 дочерних элемента.'};
          return {pass:true};
        }
      },
      {
        day: 8, title: 'Адаптивность: media queries',
        explanation:
`Media query применяет стили только при определённых условиях
(например, ширине экрана) — так сайт подстраивается под телефон:

  <style>
    .box { background: teal; }
    @media (max-width: 600px) {
      .box { background: coral; }
    }
  </style>

При ширине экрана ≤ 600px (например, телефон) .box станет coral,
на широких экранах — останется teal. Так строится "адаптивный дизайн".`,
        example: `<style>\n  .box { padding: 20px; background: teal; }\n  @media (max-width: 600px) {\n    .box { background: coral; }\n  }\n</style>\n<div class="box">Текст</div>`,
        exercisePrompt: 'Создай <div class="box"> и @media (max-width: 600px) правило, меняющее фон .box на другой цвет.',
        starter: `<style>\n  .box { background: teal; padding: 20px; }\n  @media (max-width: 600px) {\n    .box { background: coral; }\n  }\n</style>\n<div class="box">Текст</div>`,
        solution: `<style>\n  .box { background: teal; padding: 20px; }\n  @media (max-width: 600px) {\n    .box { background: coral; }\n  }\n</style>\n<div class="box">Текст</div>`,
        checkDom(doc){
          const box = doc.querySelector('.box');
          if (!box) return {pass:false, hint:'Не найден элемент с class="box".'};
          const styleTag = doc.querySelector('style');
          if (!styleTag || !/@media/.test(styleTag.textContent)) return {pass:false, hint:'В <style> должно быть правило @media (max-width: ...) { ... }'};
          return {pass:true};
        }
      }
    ]
  },

  java: {
    name: 'Java', emoji: '☕', runtime: 'sim',
    desc: 'В браузере нет компилятора Java — проверка идёт по структуре кода.',
    lessons: [
      {
        day: 1, title: 'Структура программы',
        explanation:
`Любая Java-программа начинается с класса и метода main — точки входа:

  public class Main {
      public static void main(String[] args) {
          System.out.println("Привет, мир!");
      }
  }

System.out.println() выводит текст и переводит строку.
Каждая инструкция заканчивается точкой с запятой ";".
Фигурные скобки { } обязательно должны быть парными.`,
        example: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Привет, мир!");\n    }\n}`,
        exercisePrompt: 'Напиши структуру программы (class Main, main) и выведи через System.out.println любую строку.',
        starter: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("");\n    }\n}`,
        solution: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Привет, мир!");\n    }\n}`,
        checkStatic(code){
          if (!/public\s+class\s+\w+/.test(code)) return {pass:false, hint:'Нужен класс: public class Main { ... }'};
          if (!/public\s+static\s+void\s+main/.test(code)) return {pass:false, hint:'Нужен метод main: public static void main(String[] args) { ... }'};
          if (!/System\.out\.println\s*\(/.test(code)) return {pass:false, hint:'Нужен вывод через System.out.println("...");'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки { } не сбалансированы — проверь, что каждая открытая скобка закрыта.'};
          if (!/;\s*$/m.test(code) && !/;/.test(code)) return {pass:false, hint:'Не хватает точки с запятой ";" в конце инструкции.'};
          return {pass:true};
        }
      },
      {
        day: 2, title: 'Переменные и типы',
        explanation:
`В Java тип переменной указывается явно:
  int age = 18;           // целое число
  String name = "Аня";    // строка (с большой буквы String!)
  double height = 1.65;   // дробное число
  boolean isReady = true; // true/false

Вывести несколько значений: System.out.println(name + " " + age);
Знак + для String означает "склеить строки" (конкатенация).`,
        example: `int age = 18;\nString name = "Аня";\nSystem.out.println(name + " " + age);`,
        exercisePrompt: 'Объяви int age и String name со своими значениями, выведи их вместе через println с +.',
        starter: `public class Main {\n    public static void main(String[] args) {\n        int age = 0;\n        String name = "";\n        System.out.println(name + " " + age);\n    }\n}`,
        solution: `public class Main {\n    public static void main(String[] args) {\n        int age = 20;\n        String name = "Максим";\n        System.out.println(name + " " + age);\n    }\n}`,
        checkStatic(code){
          if (!/int\s+age\s*=/.test(code)) return {pass:false, hint:'Нужна переменная: int age = ...;'};
          if (!/String\s+name\s*=/.test(code)) return {pass:false, hint:'Нужна переменная: String name = "...";  (String — с большой буквы)'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Проверь фигурные скобки — где-то не хватает закрывающей.'};
          return {pass:true};
        }
      },
      {
        day: 3, title: 'Условия if / else',
        explanation:
`if (условие) {
    // если верно
} else {
    // если нет
}

Операторы сравнения: == (равно для чисел), !=, >, <, >=, <=
Для сравнения String используй .equals(), а не == !
  name.equals("Аня")`,
        example: `int age = 20;\nif (age >= 18) {\n    System.out.println("Совершеннолетний");\n} else {\n    System.out.println("Несовершеннолетний");\n}`,
        exercisePrompt: 'Создай int score, и через if/else выведи "Сдал" если score >= 60, иначе "Не сдал".',
        starter: `public class Main {\n    public static void main(String[] args) {\n        int score = 75;\n        if (score >= 60) {\n            System.out.println("Сдал");\n        } else {\n            System.out.println("Не сдал");\n        }\n    }\n}`,
        solution: `public class Main {\n    public static void main(String[] args) {\n        int score = 75;\n        if (score >= 60) {\n            System.out.println("Сдал");\n        } else {\n            System.out.println("Не сдал");\n        }\n    }\n}`,
        checkStatic(code){
          if (!/if\s*\(.*\)/.test(code)) return {pass:false, hint:'Нужна конструкция if (условие) { ... }'};
          if (!/else/.test(code)) return {pass:false, hint:'Нужна ветка else { ... }'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 4, title: 'Циклы for',
        explanation:
`for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

Как и в JavaScript: начальное значение; условие; шаг.
i++ короткая запись для i = i + 1.`,
        example: `for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}`,
        exercisePrompt: 'Выведи числа от 1 до 5 через цикл for.',
        starter: `public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(i);\n        }\n    }\n}`,
        solution: `public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(i);\n        }\n    }\n}`,
        checkStatic(code){
          if (!/for\s*\(/.test(code)) return {pass:false, hint:'Нужен цикл: for (int i = ...; ...; i++) { ... }'};
          if (!/i\+\+|i\s*\+=\s*1/.test(code)) return {pass:false, hint:'Не забудь шаг цикла i++ — иначе цикл будет бесконечным.'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 5, title: 'Методы',
        explanation:
`Метод — это функция внутри класса:

  public static int add(int a, int b) {
      return a + b;
  }

Вызов из main: int result = add(2, 3);
static означает, что метод принадлежит классу целиком, а не отдельному
объекту — для учебных примеров почти все методы будут static.`,
        example: `public static int square(int x) {\n    return x * x;\n}\n// вызов: System.out.println(square(5));`,
        exercisePrompt: 'Напиши метод add(int a, int b), возвращающий сумму, и вызови его в main.',
        starter: `public class Main {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        System.out.println(add(2, 3));\n    }\n}`,
        solution: `public class Main {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        System.out.println(add(10, 15));\n    }\n}`,
        checkStatic(code){
          if (!/static\s+int\s+add\s*\(/.test(code)) return {pass:false, hint:'Метод должен называться add и возвращать int: public static int add(int a, int b) { ... }'};
          if (!/return/.test(code)) return {pass:false, hint:'Метод должен возвращать значение через return.'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы — методов и класса стало больше, проверь каждую пару.'};
          return {pass:true};
        }
      },
      {
        day: 6, title: 'Массивы',
        explanation:
`int[] numbers = {1, 2, 3, 4, 5};
System.out.println(numbers[0]);     // 1 (индексация с нуля)
System.out.println(numbers.length); // 5 (без скобок! не length())

Перебор:
  for (int n : numbers) {
      System.out.println(n);
  }
Это "for-each" — перебирает каждый элемент без ручного индекса.`,
        example: `int[] numbers = {1, 2, 3};\nfor (int n : numbers) {\n    System.out.println(n);\n}`,
        exercisePrompt: 'Создай int[] numbers из трёх чисел, посчитай их сумму в цикле и выведи результат через System.out.println.',
        starter: `public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {4, 10, 6};\n        int sum = 0;\n        for (int n : numbers) {\n            sum += n;\n        }\n        System.out.println(sum);\n    }\n}`,
        solution: `public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {4, 10, 6};\n        int sum = 0;\n        for (int n : numbers) {\n            sum += n;\n        }\n        System.out.println(sum);\n    }\n}`,
        checkStatic(code){
          if (!/int\[\]\s+numbers\s*=/.test(code)) return {pass:false, hint:'Нужен массив: int[] numbers = {...};'};
          if (!/for\s*\(/.test(code)) return {pass:false, hint:'Нужен цикл для перебора массива (обычный for или for-each).'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 7, title: 'Классы и объекты (ООП)',
        explanation:
`class Dog {
    String name;

    Dog(String name) {          // конструктор — без слова "void", имя = имени класса
        this.name = name;       // this — ссылка на текущий объект
    }

    String bark() {
        return name + " говорит: Гав!";
    }
}

Dog rex = new Dog("Рекс");      // создание объекта через new
System.out.println(rex.bark());`,
        example: `class Dog {\n    String name;\n    Dog(String name) { this.name = name; }\n    String bark() { return name + " говорит: Гав!"; }\n}\n// Dog rex = new Dog("Рекс");\n// System.out.println(rex.bark());`,
        exercisePrompt: 'Создай класс Cat с полем name, конструктором Cat(String name) и методом meow(), возвращающим "{name} говорит: Мяу!". Создай объект в main и выведи результат.',
        starter: `class Cat {\n    String name;\n    Cat(String name) {\n        this.name = name;\n    }\n    String meow() {\n        return name + " говорит: Мяу!";\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Cat cat = new Cat("Мурка");\n        System.out.println(cat.meow());\n    }\n}`,
        solution: `class Cat {\n    String name;\n    Cat(String name) {\n        this.name = name;\n    }\n    String meow() {\n        return name + " говорит: Мяу!";\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Cat cat = new Cat("Мурка");\n        System.out.println(cat.meow());\n    }\n}`,
        checkStatic(code){
          if (!/class\s+Cat/.test(code)) return {pass:false, hint:'Нужен класс Cat { ... }'};
          if (!/Cat\s*\(\s*String/.test(code)) return {pass:false, hint:'Нужен конструктор Cat(String name) { this.name = name; }'};
          if (!/new\s+Cat\s*\(/.test(code)) return {pass:false, hint:'Объект нужно создать через new Cat("...")'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы — теперь классов два, проверь обе пары.'};
          return {pass:true};
        }
      },
      {
        day: 8, title: 'Исключения (try/catch)',
        explanation:
`try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Деление на ноль запрещено");
}

Java обязывает явно указывать тип исключения в catch.
Частые типы: ArithmeticException, NullPointerException,
NumberFormatException (при Integer.parseInt("не число")).`,
        example: `try {\n    int x = Integer.parseInt("abc");\n} catch (NumberFormatException e) {\n    System.out.println("Это не число!");\n}`,
        exercisePrompt: 'Напиши try/catch, который делит 10 / 0 и в catch (ArithmeticException e) выводит "Деление на ноль запрещено".',
        starter: `public class Main {\n    public static void main(String[] args) {\n        try {\n            int result = 10 / 0;\n        } catch (ArithmeticException e) {\n            System.out.println("Деление на ноль запрещено");\n        }\n    }\n}`,
        solution: `public class Main {\n    public static void main(String[] args) {\n        try {\n            int result = 10 / 0;\n        } catch (ArithmeticException e) {\n            System.out.println("Деление на ноль запрещено");\n        }\n    }\n}`,
        checkStatic(code){
          if (!/try\s*\{/.test(code)) return {pass:false, hint:'Нужен блок try { ... }'};
          if (!/catch\s*\(/.test(code)) return {pass:false, hint:'Нужен блок catch (ТипИсключения e) { ... }'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      }
    ]
  },

  cpp: {
    name: 'C++', emoji: '⚙️', runtime: 'sim',
    desc: 'В браузере нет компилятора C++ — проверка идёт по структуре кода.',
    lessons: [
      {
        day: 1, title: 'Структура программы',
        explanation:
`#include <iostream>
using namespace std;

int main() {
    cout << "Привет, мир!" << endl;
    return 0;
}

#include подключает библиотеку (iostream — для ввода/вывода).
cout << выводит текст, endl переводит строку.
main() должна возвращать 0 при успешном завершении — return 0;`,
        example: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Привет, мир!" << endl;\n    return 0;\n}`,
        exercisePrompt: 'Напиши структуру программы и выведи любую строку через cout.',
        starter: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "" << endl;\n    return 0;\n}`,
        solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Привет, мир!" << endl;\n    return 0;\n}`,
        checkStatic(code){
          if (!/#include\s*<iostream>/.test(code)) return {pass:false, hint:'Нужна строка #include <iostream> в начале файла.'};
          if (!/int\s+main\s*\(/.test(code)) return {pass:false, hint:'Нужна функция int main() { ... }'};
          if (!/cout\s*<</.test(code)) return {pass:false, hint:'Нужен вывод через cout << "..." << endl;'};
          if (!/return\s+0\s*;/.test(code)) return {pass:false, hint:'main() должна заканчиваться на return 0;'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки { } не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 2, title: 'Переменные и вывод',
        explanation:
`int age = 18;
string name = "Аня";   // нужен #include <string>
double height = 1.65;
bool isReady = true;

Вывод нескольких значений подряд:
  cout << name << " " << age << endl;`,
        example: `int age = 18;\nstring name = "Аня";\ncout << name << " " << age << endl;`,
        exercisePrompt: 'Объяви int age и string name, выведи их вместе через cout <<.',
        starter: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int age = 0;\n    string name = "";\n    cout << name << " " << age << endl;\n    return 0;\n}`,
        solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int age = 20;\n    string name = "Максим";\n    cout << name << " " << age << endl;\n    return 0;\n}`,
        checkStatic(code){
          if (!/int\s+age\s*=/.test(code)) return {pass:false, hint:'Нужна переменная int age = ...;'};
          if (!/string\s+name\s*=/.test(code)) return {pass:false, hint:'Нужна переменная string name = "...";  и #include <string> в начале.'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Проверь фигурные скобки.'};
          return {pass:true};
        }
      },
      {
        day: 3, title: 'Условия if / else',
        explanation:
`if (условие) {
    // если верно
} else {
    // если нет
}

Операторы сравнения такие же, как в Java: == != > < >= <=`,
        example: `int age = 20;\nif (age >= 18) {\n    cout << "Совершеннолетний" << endl;\n} else {\n    cout << "Несовершеннолетний" << endl;\n}`,
        exercisePrompt: 'Создай int score, через if/else выведи "Сдал" при score >= 60, иначе "Не сдал".',
        starter: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int score = 75;\n    if (score >= 60) {\n        cout << "Сдал" << endl;\n    } else {\n        cout << "Не сдал" << endl;\n    }\n    return 0;\n}`,
        solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int score = 75;\n    if (score >= 60) {\n        cout << "Сдал" << endl;\n    } else {\n        cout << "Не сдал" << endl;\n    }\n    return 0;\n}`,
        checkStatic(code){
          if (!/if\s*\(.*\)/.test(code)) return {pass:false, hint:'Нужна конструкция if (условие) { ... }'};
          if (!/else/.test(code)) return {pass:false, hint:'Нужна ветка else { ... }'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 4, title: 'Циклы for',
        explanation:
`for (int i = 0; i < 5; i++) {
    cout << i << endl;
}

Полностью совпадает по логике с for в Java/JavaScript.`,
        example: `for (int i = 0; i < 5; i++) {\n    cout << i << endl;\n}`,
        exercisePrompt: 'Выведи числа от 1 до 5 через цикл for.',
        starter: `#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << i << endl;\n    }\n    return 0;\n}`,
        solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << i << endl;\n    }\n    return 0;\n}`,
        checkStatic(code){
          if (!/for\s*\(/.test(code)) return {pass:false, hint:'Нужен цикл: for (int i = ...; ...; i++) { ... }'};
          if (!/i\+\+|i\s*\+=\s*1/.test(code)) return {pass:false, hint:'Не забудь шаг i++ в цикле.'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 5, title: 'Функции',
        explanation:
`int add(int a, int b) {
    return a + b;
}

Функция объявляется вне main() и вызывается из него:
  int result = add(2, 3);

Тип перед именем функции (int) — тип возвращаемого значения.`,
        example: `int square(int x) {\n    return x * x;\n}\n// вызов: cout << square(5) << endl;`,
        exercisePrompt: 'Напиши функцию add(int a, int b), возвращающую сумму, и вызови её в main.',
        starter: `#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    cout << add(2, 3) << endl;\n    return 0;\n}`,
        solution: `#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    cout << add(10, 15) << endl;\n    return 0;\n}`,
        checkStatic(code){
          if (!/int\s+add\s*\(/.test(code)) return {pass:false, hint:'Нужна функция int add(int a, int b) { ... } вне main().'};
          if (!/return/.test(code)) return {pass:false, hint:'Функция должна возвращать значение через return.'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы — теперь их две пары (функция + main), проверь обе.'};
          return {pass:true};
        }
      },
      {
        day: 6, title: 'Векторы (vector)',
        explanation:
`vector — динамический массив (в отличие от обычного массива, может
менять размер). Нужен #include <vector>:

  #include <vector>
  vector<int> numbers = {1, 2, 3};
  numbers.push_back(4);           // добавить элемент
  cout << numbers[0] << endl;     // обращение по индексу
  cout << numbers.size() << endl; // размер

Перебор:
  for (int n : numbers) {
      cout << n << endl;
  }`,
        example: `vector<int> numbers = {1, 2, 3};\nfor (int n : numbers) {\n    cout << n << endl;\n}`,
        exercisePrompt: 'Создай vector<int> numbers из трёх чисел, посчитай их сумму в цикле и выведи через cout.',
        starter: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> numbers = {4, 10, 6};\n    int sum = 0;\n    for (int n : numbers) {\n        sum += n;\n    }\n    cout << sum << endl;\n    return 0;\n}`,
        solution: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> numbers = {4, 10, 6};\n    int sum = 0;\n    for (int n : numbers) {\n        sum += n;\n    }\n    cout << sum << endl;\n    return 0;\n}`,
        checkStatic(code){
          if (!/#include\s*<vector>/.test(code)) return {pass:false, hint:'Нужен #include <vector> в начале файла.'};
          if (!/vector<int>\s+numbers\s*=/.test(code)) return {pass:false, hint:'Нужен вектор: vector<int> numbers = {...};'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 7, title: 'Классы и объекты (ООП)',
        explanation:
`class Dog {
public:                          // public — доступно снаружи класса
    string name;

    Dog(string n) {               // конструктор — имя совпадает с именем класса
        name = n;
    }

    string bark() {
        return name + " говорит: Гав!";
    }
};                                 // точка с запятой после класса обязательна!

Dog rex("Рекс");                  // создание объекта (без new, в отличие от Java)
cout << rex.bark() << endl;`,
        example: `class Dog {\npublic:\n    string name;\n    Dog(string n) { name = n; }\n    string bark() { return name + " говорит: Гав!"; }\n};\n// Dog rex("Рекс");\n// cout << rex.bark() << endl;`,
        exercisePrompt: 'Создай класс Cat с public полем name, конструктором Cat(string n) и методом meow(), возвращающим "{name} говорит: Мяу!". Создай объект в main и выведи результат.',
        starter: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Cat {\npublic:\n    string name;\n    Cat(string n) { name = n; }\n    string meow() { return name + " говорит: Мяу!"; }\n};\n\nint main() {\n    Cat cat("Мурка");\n    cout << cat.meow() << endl;\n    return 0;\n}`,
        solution: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Cat {\npublic:\n    string name;\n    Cat(string n) { name = n; }\n    string meow() { return name + " говорит: Мяу!"; }\n};\n\nint main() {\n    Cat cat("Мурка");\n    cout << cat.meow() << endl;\n    return 0;\n}`,
        checkStatic(code){
          if (!/class\s+Cat/.test(code)) return {pass:false, hint:'Нужен класс Cat { ... };  (с точкой с запятой после закрывающей скобки!)'};
          if (!/public\s*:/.test(code)) return {pass:false, hint:'Нужна секция public: — без неё поля и методы недоступны снаружи класса.'};
          if (!/Cat\s*\(\s*string/.test(code)) return {pass:false, hint:'Нужен конструктор Cat(string n) { name = n; }'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      },
      {
        day: 8, title: 'Указатели и ссылки',
        explanation:
`Указатель хранит АДРЕС переменной в памяти — ключевая тема C++,
которой нет в таком виде в Python/JS/Java:

  int x = 10;
  int* p = &x;      // p хранит адрес x (& значит "адрес переменной")
  cout << *p;        // *p значит "значение по адресу" → 10
  *p = 20;            // меняем x через указатель → x теперь тоже 20

Ссылка — "второе имя" для существующей переменной, проще указателя:
  int& ref = x;      // ref и x — одна и та же переменная
  ref = 30;          // x тоже станет 30

Указатели дают контроль над памятью, но и main источник ошибок в C++
(обращение по неверному адресу и т.п.) — используй аккуратно.`,
        example: `int x = 10;\nint* p = &x;\ncout << *p << endl;   // 10\n*p = 20;\ncout << x << endl;    // 20`,
        exercisePrompt: 'Создай int x = 5, указатель int* p = &x, через *p измени x на 100, выведи x через cout.',
        starter: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    int* p = &x;\n    *p = 100;\n    cout << x << endl;\n    return 0;\n}`,
        solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    int* p = &x;\n    *p = 100;\n    cout << x << endl;\n    return 0;\n}`,
        checkStatic(code){
          if (!/int\*\s*p\s*=\s*&/.test(code) && !/int\s*\*\s*p\s*=\s*&/.test(code)) return {pass:false, hint:'Нужен указатель: int* p = &x;'};
          if (!/\*p\s*=/.test(code)) return {pass:false, hint:'Нужно изменить значение через указатель: *p = 100;'};
          if (!balancedBraces(code, '{', '}')) return {pass:false, hint:'Фигурные скобки не сбалансированы.'};
          return {pass:true};
        }
      }
    ]
  }

};
