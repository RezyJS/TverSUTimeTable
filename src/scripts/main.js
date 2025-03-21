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

const main = async () => {

  const weekStatus = document.querySelector('span#weekStatus');
  const timetableContainer = document.querySelector('div#timetableContainer');
  const timetableContainerYesterday = document.querySelector('div#timetableContainerYesterday');
  const timetableContainerTomorrow = document.querySelector('div#timetableContainerTomorrow');
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
  tomorrow.setDate(tomorrow.getDate() + 1);


  if (today - finishDate >= 0) {
    console.info('Занятия закончились');
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

  console.info('data filter 1');
  console.info(data);
  data.lessonsContainers.filter(({ weekMark, weekDay }) => (weekMark === week || weekMark === 'every') && weekDay === today.getDay()).forEach(item => {
    const newNode = document.createElement('div');

    const lesson = document.createElement('div');
    lesson.textContent = item.texts[1];
    const teacher = document.createElement('div');
    teacher.textContent = item.texts[2];
    const room = document.createElement('div');
    room.textContent = item.texts[3];

    newNode.appendChild(lesson);
    newNode.appendChild(teacher);
    newNode.appendChild(room);

    timetableContainer.appendChild(newNode)
  });

  console.info(yesterday.getDay());
  data.lessonsContainers.filter(({ weekMark, weekDay }) => (weekMark === week || weekMark === 'every') && weekDay === yesterday.getDay()).forEach(item => {
    const newNode = document.createElement('div');

    const lesson = document.createElement('div');
    lesson.textContent = item.texts[1];
    const teacher = document.createElement('div');
    teacher.textContent = item.texts[2];
    const room = document.createElement('div');
    room.textContent = item.texts[3];

    newNode.appendChild(lesson);
    newNode.appendChild(teacher);
    newNode.appendChild(room);

    timetableContainerYesterday.appendChild(newNode)
  });

  data.lessonsContainers.filter(({ weekMark, weekDay }) => (weekMark === week || weekMark === 'every') && weekDay === tomorrow.getDay()).forEach(item => {
    const newNode = document.createElement('div');

    const lesson = document.createElement('div');
    lesson.textContent = item.texts[1];
    const teacher = document.createElement('div');
    teacher.textContent = item.texts[2];
    const room = document.createElement('div');
    room.textContent = item.texts[3];

    newNode.appendChild(lesson);
    newNode.appendChild(teacher);
    newNode.appendChild(room);

    timetableContainerTomorrow.appendChild(newNode)
  });

  loader.style.display = 'none';
  loaderYesterday.style.display = 'none';
  loaderTomorrow.style.display = 'none';
}