(() => {
  window.addEventListener('DOMContentLoaded', () => {
    main();
  })
})()

const getMonday = (data) => {
  if (data.getDay() === 1) return data;
  const date = new Date(data);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
}

const getRUDate = (date) => {
  return `${date.slice(6)}-${date.slice(3, 5)}-${date.slice(0, 2)}` 
}

class LessonNode {
  #node;
  #order;
  #name;
  #professor;
  #room;

  constructor(order, name, professor, room) {
    this.#node = document.createElement('div');
    this.#node.classList.add('flex', 'horizontal', 'g-20', 'w-400', 'h-80');

    this.#order = order;
    this.#name = name;
    this.#professor = professor;
    this.#room = room;

    this.#createNode();
  }

  #createNode() {
    const order = document.createElement('div');
    order.classList.add('flex', 'vertical', 'start');
    order.id = 'place';
    order.textContent = this.#order;

    const aboutContainer = document.createElement('div');
    aboutContainer.classList.add('flex', 'vertical', 'start', 'g-10', 'full');

    const name = document.createElement('div');
    name.textContent = this.#name;
    name.id = 'name';

    const professor = document.createElement('div');
    professor.textContent = this.#professor;
    professor.id = 'professor';

    const room = document.createElement('div');
    room.textContent = this.#room;
    room.id = 'room';

    aboutContainer.appendChild(name);
    aboutContainer.appendChild(professor);
    aboutContainer.appendChild(room);

    this.#node.appendChild(order);
    this.#node.appendChild(aboutContainer);
  }

  get node() {
    return this.#node;
  }
}

const main = async () => {
  const weekStatus = document.querySelector('span#weekStatus');
  const timetableContainer = document.querySelector('div.timetable#today');
  const timetableContainerYesterday = document.querySelector('div.timetable#yesterday');
  const timetableContainerTomorrow = document.querySelector('div.timetable#tomorrow');
  const loader = document.querySelector('.loader#today');
  const loaderYesterday = document.querySelector('.loader#yesterday');
  const loaderTomorrow = document.querySelector('.loader#tomorrow');

  const data = (await (await fetch('https://timetable.tversu.ru/api/v1/group?group=19234&type=classes')).json())[0];
  const startDate = new Date(getRUDate(data.start));
  const finishDate = new Date(getRUDate(data.finish));
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);

  if (today - finishDate >= 0) {
    alert('Занятия закончились!');
    console.info('Занятия закончились!')
    return;
  }

  const startMonday = getMonday(startDate);
  const todayMonday = getMonday(today);

  const daysBetween = (+(todayMonday - startMonday) / 1000 / 60 / 60 / 24 / 7).toFixed(0) % 2;
  const week = daysBetween === 0 ? 'minus' : 'plus';

  if (daysBetween === 0) {
    weekStatus.textContent = '-'
    weekStatus.style.color = 'blue'
  } else {
    weekStatus.textContent = '+'
    weekStatus.style.color = 'red'
  }

  const iterables = [
    { day: yesterday.getDay(), timetable: timetableContainerYesterday, loader: loaderYesterday },
    { day: today.getDay(), timetable: timetableContainer, loader: loader },
    { day: tomorrow.getDay(), timetable: timetableContainerTomorrow, loader: loaderTomorrow },
  ]

  for (const { day, timetable, loader } of iterables) {
    const lessons = new Array(null, null, null, null, null);

    data
      .lessonsContainers
      .filter(({ weekMark, weekDay }) => (weekMark === week || weekMark === 'every') && weekDay === day)
      .forEach(item => {
        const [, name, professor, room] = item.texts;
        const newNode = new LessonNode(item.lessonNumber + 1, name, professor, room);
        lessons[item.lessonNumber] = newNode;
      })

      for (const idx in lessons) {
        if (lessons[idx] !== null) {
          timetable.appendChild(lessons[idx].node);
        } else {
          const emptyNode = new LessonNode(+idx + 1, '-', '-', '-');
          timetable.appendChild(emptyNode.node);
        }
      }
    
      loader.style.display = 'none';
  }
}