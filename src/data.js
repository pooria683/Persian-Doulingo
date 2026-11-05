// An original, compact starter course. This is not Duolingo course content.
export const units = [
  { id:'u1', title:'شروع ماجراجویی', subtitle:'اولین قدم‌ها در زبان انگلیسی', color:'#58c83f', icon:'🌱', lessons:[
    {id:'u1l1', title:'سلام، دنیا!', description:'سلام و احوال‌پرسی', words:[['hello','سلام'],['goodbye','خداحافظ'],['please','لطفاً'],['thanks','ممنون']]},
    {id:'u1l2', title:'آدم‌های اطراف من', description:'آدم‌ها و خانواده', words:[['mother','مادر'],['father','پدر'],['friend','دوست'],['family','خانواده']]},
    {id:'u1l3', title:'چیزهای ساده', description:'کلمات روزمره', words:[['book','کتاب'],['water','آب'],['house','خانه'],['apple','سیب']]},
  ]},
  { id:'u2', title:'دنیای من', subtitle:'چیزهایی که هر روز می‌بینی', color:'#8a6de9', icon:'✨', lessons:[
    {id:'u2l1', title:'رنگارنگ', description:'رنگ‌های پرکاربرد', words:[['red','قرمز'],['blue','آبی'],['green','سبز'],['yellow','زرد']]},
    {id:'u2l2', title:'وقت غذاست', description:'خوردنی‌ها و نوشیدنی‌ها', words:[['bread','نان'],['milk','شیر'],['coffee','قهوه'],['rice','برنج']]},
    {id:'u2l3', title:'دوستان حیوان', description:'اسم حیوانات', words:[['cat','گربه'],['dog','سگ'],['bird','پرنده'],['fish','ماهی']]},
  ]},
  { id:'u3', title:'زندگی روزمره', subtitle:'کلماتی برای هر روز', color:'#f1a944', icon:'☀️', lessons:[
    {id:'u3l1', title:'زمان و روزها', description:'دربارهٔ زمان', words:[['day','روز'],['night','شب'],['morning','صبح'],['today','امروز']]},
    {id:'u3l2', title:'در شهر', description:'جاهای آشنا', words:[['school','مدرسه'],['store','فروشگاه'],['street','خیابان'],['park','پارک']]},
    {id:'u3l3', title:'در حرکت', description:'کارهای روزمره', words:[['walk','راه رفتن'],['read','خواندن'],['write','نوشتن'],['sleep','خوابیدن']]},
  ]},
  { id:'u4', title:'یک قدم جلوتر', subtitle:'دایرهٔ لغتت را بزرگ‌تر کن', color:'#ee829e', icon:'🚀', lessons:[
    {id:'u4l1', title:'حس و حال', description:'احساسات ساده', words:[['happy','خوشحال'],['sad','غمگین'],['tired','خسته'],['excited','هیجان‌زده']]},
    {id:'u4l2', title:'طبیعت زیبا', description:'دنیای اطراف ما', words:[['sun','خورشید'],['moon','ماه'],['tree','درخت'],['flower','گل']]},
    {id:'u4l3', title:'صفت‌ها', description:'توصیف چیزها', words:[['big','بزرگ'],['small','کوچک'],['beautiful','زیبا'],['new','جدید']]},
  ]},
];
export const lessons = units.flatMap(unit => unit.lessons.map(lesson => ({...lesson, unitId:unit.id, unitTitle:unit.title})));
export const allWords = lessons.flatMap(lesson => lesson.words.map(([english,persian]) => ({english,persian,lessonId:lesson.id})));
