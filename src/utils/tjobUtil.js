//toDo转成fullCalendar格式
export function toDoTranse(s){
    s.start = s.date
    s.title = s.toDo.title
    return s
  }