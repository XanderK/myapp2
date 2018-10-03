// Вспомогательные функции по работе с датой и временем

module.exports.toString = (date) => {
  const options = {
    //era: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    //weekday: 'long',
    //timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric'
    //second: 'numeric'
  };
  return new Intl.DateTimeFormat('ru', options).format(date)
} 