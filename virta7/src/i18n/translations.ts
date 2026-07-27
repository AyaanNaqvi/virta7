import type { LocaleCode } from './locales';

export interface Translations {
  nav_home: string;
  nav_virta: string;
  nav_missions: string;
  nav_timetable: string;
  nav_diary: string;
  nav_tasks: string;
  nav_stars: string;
  nav_profile: string;

  weekday_monday: string;
  weekday_tuesday: string;
  weekday_wednesday: string;
  weekday_thursday: string;
  weekday_friday: string;
  weekday_saturday: string;
  weekday_sunday: string;
  weekday_short_monday: string;
  weekday_short_tuesday: string;
  weekday_short_wednesday: string;
  weekday_short_thursday: string;
  weekday_short_friday: string;
  weekday_short_saturday: string;
  weekday_short_sunday: string;

  home_hello: string;
  home_friend: string;
  home_todaysTimetable: string;
  home_seeAll: string;
  home_allDoneTitle: string;
  home_allDoneSubtitle: string;
  home_noRoutine: string;
  home_starsTodayTitle: string;
  home_starsTodaySubtitle: string;
  home_youHaveStars: string;
  home_star: string;
  home_starsPlural: string;
  home_tapRewards: string;
  home_earnStarsTitle: string;
  home_tapTasks: string;

  timetable_title: string;
  timetable_chooseDay: string;
  timetable_noBlocks: string;
  timetable_doneOf: string;

  tasks_title: string;
  tasks_noTasksYet: string;
  tasks_askCaregiver: string;
  tasks_subtitle: string;
  tasks_allDone: string;
  tasks_completed: string;
  tasks_waitingApproval: string;
  tasks_waitingApprovalHeading: string;

  stars_title: string;
  stars_yourStars: string;
  stars_canRedeem: string;
  stars_nextReward: string;
  stars_rewardsTitle: string;
  stars_noRewards: string;
  stars_redeem: string;
  stars_yay: string;
  stars_alreadyRedeemed: string;
  stars_redeemed: string;

  diary_title: string;
  diary_subtitle: string;
  diary_addEntry: string;
  diary_noEntries: string;
  diary_tapAddEntry: string;
  diaryForm_title: string;
  diaryForm_subtitle: string;
  diaryForm_placeholder: string;
  diaryForm_cancel: string;
  diaryForm_save: string;

  profile_title: string;
  profile_friend: string;
  profile_textSize: string;
  profile_small: string;
  profile_medium: string;
  profile_large: string;
  profile_xlarge: string;
  profile_highContrast: string;
  profile_highContrastDesc: string;
  profile_reduceMotion: string;
  profile_reduceMotionDesc: string;
  profile_logOut: string;
  profile_language: string;

  login_title: string;
  login_welcomeBack: string;
  login_tutorAdmin: string;
  login_childsCode: string;
  login_email: string;
  login_password: string;
  login_logIn: string;
  login_noAccount: string;
  login_register: string;
  login_enterCode: string;
  login_loginCode: string;
  login_pin: string;
  login_enter: string;
  login_error: string;

  register_title: string;
  register_subtitle: string;
  register_tutor: string;
  register_admin: string;
  register_yourName: string;
  register_email: string;
  register_password: string;
  register_adminCode: string;
  register_createAccount: string;
  register_alreadyHave: string;
  register_logIn: string;
  register_passwordLength: string;
  register_error: string;

  greeting_skip: string;
  greeting_hiName: string;
  greeting_hi: string;
  greeting_whatDoing: string;
  greeting_imVirtinhoName: string;
  greeting_imVirtinho: string;
  greeting_andImVirtinha: string;
  greeting_appIntro: string;
  greeting_timetableIntro: string;
  greeting_tasksIntro: string;
  greeting_starsIntro: string;
  greeting_diaryIntro: string;
  greeting_missionsIntro: string;
  greeting_virtaGoIntro: string;
  greeting_pickSomething: string;
  greeting_whatWouldYouLikeToDo: string;
  greeting_niceGoAhead: string;
  greeting_myTimetable: string;
  greeting_missions: string;
  greeting_earnStars: string;
  greeting_relax: string;

  virtago_whoChat: string;
  virtago_pickFriend: string;
  virtago_talkWith: string;
  virtago_typing: string;
  virtago_placeholder: string;
  virtago_hiImName: string;

  missions_title: string;
  missions_loading: string;
  missions_couldntLoad: string;
  missions_noVideos: string;
  missions_subtitle: string;
  missions_missionOfDay: string;
  missions_missionOfDayPopupHeading: string;
  missions_letsGo: string;
}

const enUS: Translations = {
  nav_home: 'Home',
  nav_virta: 'Virta',
  nav_missions: 'Missions',
  nav_timetable: 'Timetable',
  nav_diary: 'Diary',
  nav_tasks: 'Tasks',
  nav_stars: 'Stars',
  nav_profile: 'Profile',

  weekday_monday: 'Monday',
  weekday_tuesday: 'Tuesday',
  weekday_wednesday: 'Wednesday',
  weekday_thursday: 'Thursday',
  weekday_friday: 'Friday',
  weekday_saturday: 'Saturday',
  weekday_sunday: 'Sunday',
  weekday_short_monday: 'Mon',
  weekday_short_tuesday: 'Tue',
  weekday_short_wednesday: 'Wed',
  weekday_short_thursday: 'Thu',
  weekday_short_friday: 'Fri',
  weekday_short_saturday: 'Sat',
  weekday_short_sunday: 'Sun',

  home_hello: 'Hello,',
  home_friend: 'friend',
  home_todaysTimetable: "Today's timetable",
  home_seeAll: 'See all',
  home_allDoneTitle: 'All done for today!',
  home_allDoneSubtitle: 'Great job finishing your routine.',
  home_noRoutine: 'No routine set up for today yet. Ask your caregiver to add one.',
  home_starsTodayTitle: 'Stars earned today',
  home_starsTodaySubtitle: "Keep going, you're doing great!",
  home_youHaveStars: 'You have {count} {unit} to spend!',
  home_star: 'star',
  home_starsPlural: 'stars',
  home_tapRewards: 'Tap to see rewards you can redeem.',
  home_earnStarsTitle: 'Earn stars to unlock rewards!',
  home_tapTasks: 'Tap to see tasks you can complete.',

  timetable_title: 'Timetable',
  timetable_chooseDay: 'Choose a day',
  timetable_noBlocks: 'No routine blocks for this day yet. Ask your caregiver to add some.',
  timetable_doneOf: '{done} of {total} done',

  tasks_title: 'Tasks',
  tasks_noTasksYet: 'No tasks yet',
  tasks_askCaregiver: 'Ask your caregiver to add some.',
  tasks_subtitle: 'Complete tasks to earn stars.',
  tasks_allDone: 'All tasks are done. Great job!',
  tasks_completed: 'Completed',
  tasks_waitingApproval: 'Waiting for your caregiver to check it',
  tasks_waitingApprovalHeading: 'Waiting for approval',

  stars_title: 'Stars',
  stars_yourStars: 'Your stars',
  stars_canRedeem: 'You can redeem "{title}"!',
  stars_nextReward: 'Next reward: {title}',
  stars_rewardsTitle: 'Rewards',
  stars_noRewards: 'No rewards yet. Ask your caregiver to add some.',
  stars_redeem: 'Redeem',
  stars_yay: 'Yay!',
  stars_alreadyRedeemed: 'Already redeemed',
  stars_redeemed: 'Redeemed',

  diary_title: 'Diary',
  diary_subtitle: 'Write about your day.',
  diary_addEntry: 'Add entry',
  diary_noEntries: 'No diary entries yet',
  diary_tapAddEntry: 'Tap "Add entry" to write about your day.',
  diaryForm_title: 'New entry',
  diaryForm_subtitle: 'What happened today?',
  diaryForm_placeholder: 'Today I...',
  diaryForm_cancel: 'Cancel',
  diaryForm_save: 'Save',

  profile_title: 'Profile',
  profile_friend: 'Friend',
  profile_textSize: 'Text size',
  profile_small: 'Small',
  profile_medium: 'Medium',
  profile_large: 'Large',
  profile_xlarge: 'X-Large',
  profile_highContrast: 'High contrast',
  profile_highContrastDesc: 'Stronger colors, easier to see',
  profile_reduceMotion: 'Reduce motion',
  profile_reduceMotionDesc: 'Turns off animations',
  profile_logOut: 'Log out',
  profile_language: 'Language',

  login_title: 'Log in',
  login_welcomeBack: 'Welcome back to Virta7.',
  login_tutorAdmin: 'Tutor / Admin',
  login_childsCode: "Child's code",
  login_email: 'Email',
  login_password: 'Password',
  login_logIn: 'Log in',
  login_noAccount: 'No account?',
  login_register: 'Register',
  login_enterCode: 'Enter the login code and PIN your tutor gave you.',
  login_loginCode: 'Login code',
  login_pin: 'PIN',
  login_enter: 'Enter',
  login_error: 'Something went wrong. Is the server running?',

  register_title: 'Create an account',
  register_subtitle: 'Register as a tutor to manage your own child, or as an admin.',
  register_tutor: 'Tutor',
  register_admin: 'Admin',
  register_yourName: 'Your name',
  register_email: 'Email',
  register_password: 'Password',
  register_adminCode: 'Admin code',
  register_createAccount: 'Create account',
  register_alreadyHave: 'Already have an account?',
  register_logIn: 'Log in',
  register_passwordLength: 'Password must be at least 6 characters.',
  register_error: 'Something went wrong. Is the server running?',

  greeting_skip: 'Skip',
  greeting_hiName: 'Hi {name}! How are you today?',
  greeting_hi: 'Hi! How are you today?',
  greeting_whatDoing: 'What are you trying to do today?',
  greeting_imVirtinhoName: "Hi {name}! I'm Virtinho.",
  greeting_imVirtinho: "Hi! I'm Virtinho.",
  greeting_andImVirtinha: "And I'm Virtinha!",
  greeting_appIntro: 'This app is called Virta7. Let us show you around.',
  greeting_timetableIntro: 'Timetable shows your routine for each day.',
  greeting_tasksIntro: 'Tasks are small jobs you can do to earn stars.',
  greeting_starsIntro: 'Stars can be traded for rewards you like.',
  greeting_diaryIntro: 'Diary is a private place to write about your day.',
  greeting_missionsIntro: 'Missions are videos picked just for you.',
  greeting_virtaGoIntro: 'Virta Go is where you can chat with us anytime.',
  greeting_pickSomething: "Now let's pick something to do!",
  greeting_whatWouldYouLikeToDo: 'What would you like to do?',
  greeting_niceGoAhead: 'Nice, go ahead!',
  greeting_myTimetable: 'My timetable',
  greeting_missions: 'Missions',
  greeting_earnStars: 'Earn stars',
  greeting_relax: 'Relax',

  virtago_whoChat: 'Who do you want to chat with?',
  virtago_pickFriend: 'Pick a friend to talk to.',
  virtago_talkWith: 'Talk with {name}',
  virtago_typing: '{name} is typing…',
  virtago_placeholder: 'Type a message…',
  virtago_hiImName: "Hi! I'm {name}. What's on your mind today?",

  missions_title: 'Missions',
  missions_loading: 'Loading…',
  missions_couldntLoad: "Couldn't load videos right now. Ask your tutor to check the connection.",
  missions_noVideos: 'No videos added by tutor yet.',
  missions_subtitle: 'Videos picked for you. Tap one to watch.',
  missions_missionOfDay: 'Mission of the Day',
  missions_missionOfDayPopupHeading: "Today's Mission!",
  missions_letsGo: "Let's go!",
};

const enGB: Translations = {
  ...enUS,
};

const ptPT: Translations = {
  nav_home: 'Início',
  nav_virta: 'Virta',
  nav_missions: 'Missões',
  nav_timetable: 'Horário',
  nav_diary: 'Diário',
  nav_tasks: 'Tarefas',
  nav_stars: 'Estrelas',
  nav_profile: 'Perfil',

  weekday_monday: 'Segunda-feira',
  weekday_tuesday: 'Terça-feira',
  weekday_wednesday: 'Quarta-feira',
  weekday_thursday: 'Quinta-feira',
  weekday_friday: 'Sexta-feira',
  weekday_saturday: 'Sábado',
  weekday_sunday: 'Domingo',
  weekday_short_monday: 'Seg',
  weekday_short_tuesday: 'Ter',
  weekday_short_wednesday: 'Qua',
  weekday_short_thursday: 'Qui',
  weekday_short_friday: 'Sex',
  weekday_short_saturday: 'Sáb',
  weekday_short_sunday: 'Dom',

  home_hello: 'Olá,',
  home_friend: 'amigo',
  home_todaysTimetable: 'Horário de hoje',
  home_seeAll: 'Ver tudo',
  home_allDoneTitle: 'Tudo feito por hoje!',
  home_allDoneSubtitle: 'Bom trabalho a terminar a tua rotina.',
  home_noRoutine: 'Ainda não há rotina para hoje. Pede ao teu cuidador para adicionar uma.',
  home_starsTodayTitle: 'Estrelas ganhas hoje',
  home_starsTodaySubtitle: 'Continua, estás a ir muito bem!',
  home_youHaveStars: 'Tens {count} {unit} para gastar!',
  home_star: 'estrela',
  home_starsPlural: 'estrelas',
  home_tapRewards: 'Toca para ver os prémios que podes trocar.',
  home_earnStarsTitle: 'Ganha estrelas para desbloquear prémios!',
  home_tapTasks: 'Toca para ver as tarefas que podes fazer.',

  timetable_title: 'Horário',
  timetable_chooseDay: 'Escolhe um dia',
  timetable_noBlocks: 'Ainda não há atividades para este dia. Pede ao teu cuidador para adicionar algumas.',
  timetable_doneOf: '{done} de {total} feitas',

  tasks_title: 'Tarefas',
  tasks_noTasksYet: 'Ainda não há tarefas',
  tasks_askCaregiver: 'Pede ao teu cuidador para adicionar algumas.',
  tasks_subtitle: 'Completa tarefas para ganhar estrelas.',
  tasks_allDone: 'Todas as tarefas estão feitas. Bom trabalho!',
  tasks_completed: 'Concluída',
  tasks_waitingApproval: 'A aguardar que o teu cuidador verifique',
  tasks_waitingApprovalHeading: 'A aguardar aprovação',

  stars_title: 'Estrelas',
  stars_yourStars: 'As tuas estrelas',
  stars_canRedeem: 'Já podes trocar "{title}"!',
  stars_nextReward: 'Próximo prémio: {title}',
  stars_rewardsTitle: 'Prémios',
  stars_noRewards: 'Ainda não há prémios. Pede ao teu cuidador para adicionar alguns.',
  stars_redeem: 'Trocar',
  stars_yay: 'Boa!',
  stars_alreadyRedeemed: 'Já trocados',
  stars_redeemed: 'Trocado',

  diary_title: 'Diário',
  diary_subtitle: 'Escreve sobre o teu dia.',
  diary_addEntry: 'Adicionar registo',
  diary_noEntries: 'Ainda não há registos no diário',
  diary_tapAddEntry: 'Toca em "Adicionar registo" para escreveres sobre o teu dia.',
  diaryForm_title: 'Novo registo',
  diaryForm_subtitle: 'O que aconteceu hoje?',
  diaryForm_placeholder: 'Hoje eu...',
  diaryForm_cancel: 'Cancelar',
  diaryForm_save: 'Guardar',

  profile_title: 'Perfil',
  profile_friend: 'Amigo',
  profile_textSize: 'Tamanho do texto',
  profile_small: 'Pequeno',
  profile_medium: 'Médio',
  profile_large: 'Grande',
  profile_xlarge: 'Muito grande',
  profile_highContrast: 'Alto contraste',
  profile_highContrastDesc: 'Cores mais fortes, mais fáceis de ver',
  profile_reduceMotion: 'Reduzir movimento',
  profile_reduceMotionDesc: 'Desliga as animações',
  profile_logOut: 'Terminar sessão',
  profile_language: 'Idioma',

  login_title: 'Iniciar sessão',
  login_welcomeBack: 'Bem-vindo de volta ao Virta7.',
  login_tutorAdmin: 'Tutor / Admin',
  login_childsCode: 'Código da criança',
  login_email: 'Email',
  login_password: 'Palavra-passe',
  login_logIn: 'Iniciar sessão',
  login_noAccount: 'Não tens conta?',
  login_register: 'Registar',
  login_enterCode: 'Introduz o código e o PIN que o teu tutor te deu.',
  login_loginCode: 'Código de acesso',
  login_pin: 'PIN',
  login_enter: 'Entrar',
  login_error: 'Algo correu mal. O servidor está a funcionar?',

  register_title: 'Criar conta',
  register_subtitle: 'Regista-te como tutor para geres o teu filho, ou como admin.',
  register_tutor: 'Tutor',
  register_admin: 'Admin',
  register_yourName: 'O teu nome',
  register_email: 'Email',
  register_password: 'Palavra-passe',
  register_adminCode: 'Código de admin',
  register_createAccount: 'Criar conta',
  register_alreadyHave: 'Já tens conta?',
  register_logIn: 'Iniciar sessão',
  register_passwordLength: 'A palavra-passe deve ter pelo menos 6 caracteres.',
  register_error: 'Algo correu mal. O servidor está a funcionar?',

  greeting_skip: 'Saltar',
  greeting_hiName: 'Olá {name}! Como estás hoje?',
  greeting_hi: 'Olá! Como estás hoje?',
  greeting_whatDoing: 'O que queres fazer hoje?',
  greeting_imVirtinhoName: 'Olá {name}! Eu sou o Virtinho.',
  greeting_imVirtinho: 'Olá! Eu sou o Virtinho.',
  greeting_andImVirtinha: 'E eu sou a Virtinha!',
  greeting_appIntro: 'Esta aplicação chama-se Virta7. Deixa-nos mostrar-te como funciona.',
  greeting_timetableIntro: 'O Horário mostra a tua rotina de cada dia.',
  greeting_tasksIntro: 'As Tarefas são pequenos trabalhos que podes fazer para ganhar estrelas.',
  greeting_starsIntro: 'As Estrelas podem ser trocadas por prémios que gostas.',
  greeting_diaryIntro: 'O Diário é um lugar privado para escreveres sobre o teu dia.',
  greeting_missionsIntro: 'As Missões são vídeos escolhidos só para ti.',
  greeting_virtaGoIntro: 'O Virta Go é onde podes falar connosco a qualquer momento.',
  greeting_pickSomething: 'Agora vamos escolher algo para fazer!',
  greeting_whatWouldYouLikeToDo: 'O que gostarias de fazer?',
  greeting_niceGoAhead: 'Boa, força!',
  greeting_myTimetable: 'O meu horário',
  greeting_missions: 'Missões',
  greeting_earnStars: 'Ganhar estrelas',
  greeting_relax: 'Relaxar',

  virtago_whoChat: 'Com quem queres falar?',
  virtago_pickFriend: 'Escolhe um amigo para conversar.',
  virtago_talkWith: 'Falar com {name}',
  virtago_typing: '{name} está a escrever…',
  virtago_placeholder: 'Escreve uma mensagem…',
  virtago_hiImName: 'Olá! Eu sou o/a {name}. Em que estás a pensar hoje?',

  missions_title: 'Missões',
  missions_loading: 'A carregar…',
  missions_couldntLoad: 'Não foi possível carregar os vídeos. Pede ao teu tutor para verificar a ligação.',
  missions_noVideos: 'O tutor ainda não adicionou vídeos.',
  missions_subtitle: 'Vídeos escolhidos para ti. Toca num para ver.',
  missions_missionOfDay: 'Missão do Dia',
  missions_missionOfDayPopupHeading: 'A Missão de Hoje!',
  missions_letsGo: 'Vamos lá!',
};

const ptBR: Translations = {
  ...ptPT,
  nav_home: 'Início',
  home_hello: 'Olá,',
  home_friend: 'amigo',
  home_todaysTimetable: 'Agenda de hoje',
  home_allDoneSubtitle: 'Bom trabalho terminando sua rotina.',
  home_noRoutine: 'Ainda não há rotina para hoje. Peça para seu cuidador adicionar uma.',
  home_starsTodaySubtitle: 'Continue, você está indo muito bem!',
  home_youHaveStars: 'Você tem {count} {unit} para gastar!',
  home_tapRewards: 'Toque para ver os prêmios que você pode trocar.',
  home_earnStarsTitle: 'Ganhe estrelas para desbloquear prêmios!',
  home_tapTasks: 'Toque para ver as tarefas que você pode fazer.',
  timetable_title: 'Agenda',
  timetable_chooseDay: 'Escolha um dia',
  timetable_noBlocks: 'Ainda não há atividades para este dia. Peça para seu cuidador adicionar algumas.',
  tasks_askCaregiver: 'Peça para seu cuidador adicionar algumas.',
  tasks_subtitle: 'Complete tarefas para ganhar estrelas.',
  stars_yourStars: 'Suas estrelas',
  stars_canRedeem: 'Você já pode trocar "{title}"!',
  stars_noRewards: 'Ainda não há prêmios. Peça para seu cuidador adicionar alguns.',
  stars_redeem: 'Trocar',
  stars_alreadyRedeemed: 'Já trocados',
  stars_redeemed: 'Trocado',
  diary_subtitle: 'Escreva sobre o seu dia.',
  diary_tapAddEntry: 'Toque em "Adicionar registro" para escrever sobre o seu dia.',
  diary_addEntry: 'Adicionar registro',
  diary_noEntries: 'Ainda não há registros no diário',
  diaryForm_placeholder: 'Hoje eu...',
  diaryForm_save: 'Salvar',
  profile_highContrastDesc: 'Cores mais fortes, mais fáceis de ver',
  profile_reduceMotionDesc: 'Desliga as animações',
  profile_logOut: 'Sair',
  profile_language: 'Idioma',
  login_title: 'Entrar',
  login_welcomeBack: 'Bem-vindo de volta ao Virta7.',
  login_childsCode: 'Código da criança',
  login_password: 'Senha',
  login_logIn: 'Entrar',
  login_noAccount: 'Não tem conta?',
  login_enterCode: 'Digite o código e o PIN que seu tutor te deu.',
  login_error: 'Algo deu errado. O servidor está funcionando?',
  register_subtitle: 'Cadastre-se como tutor para gerenciar seu filho, ou como admin.',
  register_yourName: 'Seu nome',
  register_password: 'Senha',
  register_alreadyHave: 'Já tem conta?',
  register_passwordLength: 'A senha deve ter pelo menos 6 caracteres.',
  register_error: 'Algo deu errado. O servidor está funcionando?',
  greeting_hiName: 'Oi {name}! Como você está hoje?',
  greeting_hi: 'Oi! Como você está hoje?',
  greeting_whatDoing: 'O que você quer fazer hoje?',
  greeting_imVirtinhoName: 'Oi {name}! Eu sou o Virtinho.',
  greeting_imVirtinho: 'Oi! Eu sou o Virtinho.',
  greeting_appIntro: 'Este aplicativo se chama Virta7. Vamos te mostrar como funciona.',
  greeting_diaryIntro: 'O Diário é um lugar privado para você escrever sobre o seu dia.',
  greeting_pickSomething: 'Agora vamos escolher algo para fazer!',
  greeting_whatWouldYouLikeToDo: 'O que você gostaria de fazer?',
  virtago_hiImName: 'Oi! Eu sou o/a {name}. No que você está pensando hoje?',
  missions_loading: 'Carregando…',
  missions_couldntLoad: 'Não foi possível carregar os vídeos agora. Peça ao seu tutor para verificar a conexão.',
  missions_noVideos: 'O tutor ainda não adicionou vídeos.',
};

const es: Translations = {
  nav_home: 'Inicio',
  nav_virta: 'Virta',
  nav_missions: 'Misiones',
  nav_timetable: 'Horario',
  nav_diary: 'Diario',
  nav_tasks: 'Tareas',
  nav_stars: 'Estrellas',
  nav_profile: 'Perfil',

  weekday_monday: 'Lunes',
  weekday_tuesday: 'Martes',
  weekday_wednesday: 'Miércoles',
  weekday_thursday: 'Jueves',
  weekday_friday: 'Viernes',
  weekday_saturday: 'Sábado',
  weekday_sunday: 'Domingo',
  weekday_short_monday: 'Lun',
  weekday_short_tuesday: 'Mar',
  weekday_short_wednesday: 'Mié',
  weekday_short_thursday: 'Jue',
  weekday_short_friday: 'Vie',
  weekday_short_saturday: 'Sáb',
  weekday_short_sunday: 'Dom',

  home_hello: 'Hola,',
  home_friend: 'amigo',
  home_todaysTimetable: 'Horario de hoy',
  home_seeAll: 'Ver todo',
  home_allDoneTitle: '¡Todo listo por hoy!',
  home_allDoneSubtitle: 'Buen trabajo terminando tu rutina.',
  home_noRoutine: 'Todavía no hay rutina para hoy. Pide a tu cuidador que añada una.',
  home_starsTodayTitle: 'Estrellas ganadas hoy',
  home_starsTodaySubtitle: '¡Sigue así, lo estás haciendo muy bien!',
  home_youHaveStars: '¡Tienes {count} {unit} para gastar!',
  home_star: 'estrella',
  home_starsPlural: 'estrellas',
  home_tapRewards: 'Toca para ver los premios que puedes canjear.',
  home_earnStarsTitle: '¡Gana estrellas para desbloquear premios!',
  home_tapTasks: 'Toca para ver las tareas que puedes hacer.',

  timetable_title: 'Horario',
  timetable_chooseDay: 'Elige un día',
  timetable_noBlocks: 'Todavía no hay actividades para este día. Pide a tu cuidador que añada algunas.',
  timetable_doneOf: '{done} de {total} hechas',

  tasks_title: 'Tareas',
  tasks_noTasksYet: 'Todavía no hay tareas',
  tasks_askCaregiver: 'Pide a tu cuidador que añada algunas.',
  tasks_subtitle: 'Completa tareas para ganar estrellas.',
  tasks_allDone: '¡Todas las tareas están hechas. Buen trabajo!',
  tasks_completed: 'Completada',
  tasks_waitingApproval: 'Esperando a que tu cuidador lo revise',
  tasks_waitingApprovalHeading: 'Esperando aprobación',

  stars_title: 'Estrellas',
  stars_yourStars: 'Tus estrellas',
  stars_canRedeem: '¡Ya puedes canjear "{title}"!',
  stars_nextReward: 'Próximo premio: {title}',
  stars_rewardsTitle: 'Premios',
  stars_noRewards: 'Todavía no hay premios. Pide a tu cuidador que añada algunos.',
  stars_redeem: 'Canjear',
  stars_yay: '¡Genial!',
  stars_alreadyRedeemed: 'Ya canjeados',
  stars_redeemed: 'Canjeado',

  diary_title: 'Diario',
  diary_subtitle: 'Escribe sobre tu día.',
  diary_addEntry: 'Añadir entrada',
  diary_noEntries: 'Todavía no hay entradas en el diario',
  diary_tapAddEntry: 'Toca "Añadir entrada" para escribir sobre tu día.',
  diaryForm_title: 'Nueva entrada',
  diaryForm_subtitle: '¿Qué pasó hoy?',
  diaryForm_placeholder: 'Hoy yo...',
  diaryForm_cancel: 'Cancelar',
  diaryForm_save: 'Guardar',

  profile_title: 'Perfil',
  profile_friend: 'Amigo',
  profile_textSize: 'Tamaño del texto',
  profile_small: 'Pequeño',
  profile_medium: 'Mediano',
  profile_large: 'Grande',
  profile_xlarge: 'Muy grande',
  profile_highContrast: 'Alto contraste',
  profile_highContrastDesc: 'Colores más fuertes, más fáciles de ver',
  profile_reduceMotion: 'Reducir movimiento',
  profile_reduceMotionDesc: 'Apaga las animaciones',
  profile_logOut: 'Cerrar sesión',
  profile_language: 'Idioma',

  login_title: 'Iniciar sesión',
  login_welcomeBack: 'Bienvenido de nuevo a Virta7.',
  login_tutorAdmin: 'Tutor / Admin',
  login_childsCode: 'Código del niño',
  login_email: 'Correo electrónico',
  login_password: 'Contraseña',
  login_logIn: 'Iniciar sesión',
  login_noAccount: '¿No tienes cuenta?',
  login_register: 'Regístrate',
  login_enterCode: 'Introduce el código y el PIN que te dio tu tutor.',
  login_loginCode: 'Código de acceso',
  login_pin: 'PIN',
  login_enter: 'Entrar',
  login_error: 'Algo salió mal. ¿Está el servidor funcionando?',

  register_title: 'Crear una cuenta',
  register_subtitle: 'Regístrate como tutor para gestionar a tu hijo, o como admin.',
  register_tutor: 'Tutor',
  register_admin: 'Admin',
  register_yourName: 'Tu nombre',
  register_email: 'Correo electrónico',
  register_password: 'Contraseña',
  register_adminCode: 'Código de admin',
  register_createAccount: 'Crear cuenta',
  register_alreadyHave: '¿Ya tienes cuenta?',
  register_logIn: 'Iniciar sesión',
  register_passwordLength: 'La contraseña debe tener al menos 6 caracteres.',
  register_error: 'Algo salió mal. ¿Está el servidor funcionando?',

  greeting_skip: 'Saltar',
  greeting_hiName: '¡Hola {name}! ¿Cómo estás hoy?',
  greeting_hi: '¡Hola! ¿Cómo estás hoy?',
  greeting_whatDoing: '¿Qué quieres hacer hoy?',
  greeting_imVirtinhoName: '¡Hola {name}! Soy Virtinho.',
  greeting_imVirtinho: '¡Hola! Soy Virtinho.',
  greeting_andImVirtinha: '¡Y yo soy Virtinha!',
  greeting_appIntro: 'Esta aplicación se llama Virta7. Déjanos mostrarte cómo funciona.',
  greeting_timetableIntro: 'El Horario muestra tu rutina de cada día.',
  greeting_tasksIntro: 'Las Tareas son trabajos pequeños que puedes hacer para ganar estrellas.',
  greeting_starsIntro: 'Las Estrellas se pueden cambiar por premios que te gusten.',
  greeting_diaryIntro: 'El Diario es un lugar privado para escribir sobre tu día.',
  greeting_missionsIntro: 'Las Misiones son videos elegidos solo para ti.',
  greeting_virtaGoIntro: 'Virta Go es donde puedes hablar con nosotros cuando quieras.',
  greeting_pickSomething: '¡Ahora vamos a elegir algo para hacer!',
  greeting_whatWouldYouLikeToDo: '¿Qué te gustaría hacer?',
  greeting_niceGoAhead: '¡Genial, adelante!',
  greeting_myTimetable: 'Mi horario',
  greeting_missions: 'Misiones',
  greeting_earnStars: 'Ganar estrellas',
  greeting_relax: 'Relajarme',

  virtago_whoChat: '¿Con quién quieres hablar?',
  virtago_pickFriend: 'Elige un amigo para hablar.',
  virtago_talkWith: 'Hablar con {name}',
  virtago_typing: '{name} está escribiendo…',
  virtago_placeholder: 'Escribe un mensaje…',
  virtago_hiImName: '¡Hola! Soy {name}. ¿En qué estás pensando hoy?',

  missions_title: 'Misiones',
  missions_loading: 'Cargando…',
  missions_couldntLoad: 'No se pudieron cargar los videos. Pide a tu tutor que revise la conexión.',
  missions_noVideos: 'Tu tutor todavía no ha añadido videos.',
  missions_subtitle: 'Videos elegidos para ti. Toca uno para verlo.',
  missions_missionOfDay: 'Misión del Día',
  missions_missionOfDayPopupHeading: '¡La Misión de Hoy!',
  missions_letsGo: '¡Vamos!',
};

const no: Translations = {
  nav_home: 'Hjem',
  nav_virta: 'Virta',
  nav_missions: 'Oppdrag',
  nav_timetable: 'Timeplan',
  nav_diary: 'Dagbok',
  nav_tasks: 'Oppgaver',
  nav_stars: 'Stjerner',
  nav_profile: 'Profil',

  weekday_monday: 'Mandag',
  weekday_tuesday: 'Tirsdag',
  weekday_wednesday: 'Onsdag',
  weekday_thursday: 'Torsdag',
  weekday_friday: 'Fredag',
  weekday_saturday: 'Lørdag',
  weekday_sunday: 'Søndag',
  weekday_short_monday: 'Man',
  weekday_short_tuesday: 'Tir',
  weekday_short_wednesday: 'Ons',
  weekday_short_thursday: 'Tor',
  weekday_short_friday: 'Fre',
  weekday_short_saturday: 'Lør',
  weekday_short_sunday: 'Søn',

  home_hello: 'Hei,',
  home_friend: 'venn',
  home_todaysTimetable: 'Dagens timeplan',
  home_seeAll: 'Se alle',
  home_allDoneTitle: 'Alt er gjort for i dag!',
  home_allDoneSubtitle: 'Bra jobbet med å fullføre rutinen din.',
  home_noRoutine: 'Ingen rutine er satt opp for i dag ennå. Be omsorgspersonen din legge til en.',
  home_starsTodayTitle: 'Stjerner tjent i dag',
  home_starsTodaySubtitle: 'Fortsett sånn, du gjør det kjempebra!',
  home_youHaveStars: 'Du har {count} {unit} å bruke!',
  home_star: 'stjerne',
  home_starsPlural: 'stjerner',
  home_tapRewards: 'Trykk for å se belønninger du kan bruke.',
  home_earnStarsTitle: 'Tjen stjerner for å låse opp belønninger!',
  home_tapTasks: 'Trykk for å se oppgaver du kan gjøre.',

  timetable_title: 'Timeplan',
  timetable_chooseDay: 'Velg en dag',
  timetable_noBlocks: 'Ingen aktiviteter for denne dagen ennå. Be omsorgspersonen din legge til noen.',
  timetable_doneOf: '{done} av {total} gjort',

  tasks_title: 'Oppgaver',
  tasks_noTasksYet: 'Ingen oppgaver ennå',
  tasks_askCaregiver: 'Be omsorgspersonen din legge til noen.',
  tasks_subtitle: 'Fullfør oppgaver for å tjene stjerner.',
  tasks_allDone: 'Alle oppgaver er gjort. Bra jobbet!',
  tasks_completed: 'Fullført',
  tasks_waitingApproval: 'Venter på at omsorgspersonen din sjekker det',
  tasks_waitingApprovalHeading: 'Venter på godkjenning',

  stars_title: 'Stjerner',
  stars_yourStars: 'Dine stjerner',
  stars_canRedeem: 'Du kan nå løse inn "{title}"!',
  stars_nextReward: 'Neste belønning: {title}',
  stars_rewardsTitle: 'Belønninger',
  stars_noRewards: 'Ingen belønninger ennå. Be omsorgspersonen din legge til noen.',
  stars_redeem: 'Løs inn',
  stars_yay: 'Yess!',
  stars_alreadyRedeemed: 'Allerede løst inn',
  stars_redeemed: 'Løst inn',

  diary_title: 'Dagbok',
  diary_subtitle: 'Skriv om dagen din.',
  diary_addEntry: 'Legg til notat',
  diary_noEntries: 'Ingen dagboknotater ennå',
  diary_tapAddEntry: 'Trykk "Legg til notat" for å skrive om dagen din.',
  diaryForm_title: 'Nytt notat',
  diaryForm_subtitle: 'Hva skjedde i dag?',
  diaryForm_placeholder: 'I dag har jeg...',
  diaryForm_cancel: 'Avbryt',
  diaryForm_save: 'Lagre',

  profile_title: 'Profil',
  profile_friend: 'Venn',
  profile_textSize: 'Tekststørrelse',
  profile_small: 'Liten',
  profile_medium: 'Middels',
  profile_large: 'Stor',
  profile_xlarge: 'Ekstra stor',
  profile_highContrast: 'Høy kontrast',
  profile_highContrastDesc: 'Sterkere farger, lettere å se',
  profile_reduceMotion: 'Redusert bevegelse',
  profile_reduceMotionDesc: 'Skrur av animasjoner',
  profile_logOut: 'Logg ut',
  profile_language: 'Språk',

  login_title: 'Logg inn',
  login_welcomeBack: 'Velkommen tilbake til Virta7.',
  login_tutorAdmin: 'Foresatt / Admin',
  login_childsCode: 'Barnets kode',
  login_email: 'E-post',
  login_password: 'Passord',
  login_logIn: 'Logg inn',
  login_noAccount: 'Ingen konto?',
  login_register: 'Registrer deg',
  login_enterCode: 'Skriv inn koden og PIN-koden foresatt ga deg.',
  login_loginCode: 'Innloggingskode',
  login_pin: 'PIN',
  login_enter: 'Gå inn',
  login_error: 'Noe gikk galt. Kjører serveren?',

  register_title: 'Opprett en konto',
  register_subtitle: 'Registrer deg som foresatt for å administrere barnet ditt, eller som admin.',
  register_tutor: 'Foresatt',
  register_admin: 'Admin',
  register_yourName: 'Navnet ditt',
  register_email: 'E-post',
  register_password: 'Passord',
  register_adminCode: 'Adminkode',
  register_createAccount: 'Opprett konto',
  register_alreadyHave: 'Har du allerede en konto?',
  register_logIn: 'Logg inn',
  register_passwordLength: 'Passordet må ha minst 6 tegn.',
  register_error: 'Noe gikk galt. Kjører serveren?',

  greeting_skip: 'Hopp over',
  greeting_hiName: 'Hei {name}! Hvordan går det i dag?',
  greeting_hi: 'Hei! Hvordan går det i dag?',
  greeting_whatDoing: 'Hva vil du gjøre i dag?',
  greeting_imVirtinhoName: 'Hei {name}! Jeg heter Virtinho.',
  greeting_imVirtinho: 'Hei! Jeg heter Virtinho.',
  greeting_andImVirtinha: 'Og jeg heter Virtinha!',
  greeting_appIntro: 'Denne appen heter Virta7. La oss vise deg rundt.',
  greeting_timetableIntro: 'Timeplan viser rutinen din for hver dag.',
  greeting_tasksIntro: 'Oppgaver er små jobber du kan gjøre for å tjene stjerner.',
  greeting_starsIntro: 'Stjerner kan byttes mot belønninger du liker.',
  greeting_diaryIntro: 'Dagbok er et privat sted å skrive om dagen din.',
  greeting_missionsIntro: 'Oppdrag er videoer valgt bare for deg.',
  greeting_virtaGoIntro: 'Virta Go er der du kan snakke med oss når som helst.',
  greeting_pickSomething: 'Nå skal vi velge noe å gjøre!',
  greeting_whatWouldYouLikeToDo: 'Hva vil du gjøre?',
  greeting_niceGoAhead: 'Bra, sett i gang!',
  greeting_myTimetable: 'Min timeplan',
  greeting_missions: 'Oppdrag',
  greeting_earnStars: 'Tjen stjerner',
  greeting_relax: 'Slapp av',

  virtago_whoChat: 'Hvem vil du snakke med?',
  virtago_pickFriend: 'Velg en venn å snakke med.',
  virtago_talkWith: 'Snakk med {name}',
  virtago_typing: '{name} skriver…',
  virtago_placeholder: 'Skriv en melding…',
  virtago_hiImName: 'Hei! Jeg heter {name}. Hva tenker du på i dag?',

  missions_title: 'Oppdrag',
  missions_loading: 'Laster…',
  missions_couldntLoad: 'Kunne ikke laste videoer nå. Be foresatt sjekke tilkoblingen.',
  missions_noVideos: 'Ingen videoer er lagt til av foresatt ennå.',
  missions_subtitle: 'Videoer valgt for deg. Trykk på en for å se den.',
  missions_missionOfDay: 'Dagens Oppdrag',
  missions_missionOfDayPopupHeading: 'Dagens Oppdrag!',
  missions_letsGo: 'Kom igjen!',
};

const fr: Translations = {
  nav_home: 'Accueil',
  nav_virta: 'Virta',
  nav_missions: 'Missions',
  nav_timetable: 'Emploi du temps',
  nav_diary: 'Journal',
  nav_tasks: 'Tâches',
  nav_stars: 'Étoiles',
  nav_profile: 'Profil',

  weekday_monday: 'Lundi',
  weekday_tuesday: 'Mardi',
  weekday_wednesday: 'Mercredi',
  weekday_thursday: 'Jeudi',
  weekday_friday: 'Vendredi',
  weekday_saturday: 'Samedi',
  weekday_sunday: 'Dimanche',
  weekday_short_monday: 'Lun',
  weekday_short_tuesday: 'Mar',
  weekday_short_wednesday: 'Mer',
  weekday_short_thursday: 'Jeu',
  weekday_short_friday: 'Ven',
  weekday_short_saturday: 'Sam',
  weekday_short_sunday: 'Dim',

  home_hello: 'Bonjour,',
  home_friend: 'ami',
  home_todaysTimetable: "L'emploi du temps d'aujourd'hui",
  home_seeAll: 'Tout voir',
  home_allDoneTitle: 'Tout est fait pour aujourd\'hui !',
  home_allDoneSubtitle: 'Bravo, tu as terminé ta routine.',
  home_noRoutine: "Il n'y a pas encore de routine pour aujourd'hui. Demande à ton adulte référent d'en ajouter une.",
  home_starsTodayTitle: "Étoiles gagnées aujourd'hui",
  home_starsTodaySubtitle: 'Continue comme ça, tu fais du très bon travail !',
  home_youHaveStars: 'Tu as {count} {unit} à dépenser !',
  home_star: 'étoile',
  home_starsPlural: 'étoiles',
  home_tapRewards: 'Touche pour voir les récompenses que tu peux échanger.',
  home_earnStarsTitle: 'Gagne des étoiles pour débloquer des récompenses !',
  home_tapTasks: 'Touche pour voir les tâches que tu peux faire.',

  timetable_title: 'Emploi du temps',
  timetable_chooseDay: 'Choisis un jour',
  timetable_noBlocks: "Il n'y a pas encore d'activités pour ce jour. Demande à ton adulte référent d'en ajouter.",
  timetable_doneOf: '{done} sur {total} faites',

  tasks_title: 'Tâches',
  tasks_noTasksYet: 'Pas encore de tâches',
  tasks_askCaregiver: "Demande à ton adulte référent d'en ajouter.",
  tasks_subtitle: 'Termine des tâches pour gagner des étoiles.',
  tasks_allDone: 'Toutes les tâches sont faites. Bravo !',
  tasks_completed: 'Terminée',
  tasks_waitingApproval: "En attente de vérification par ton adulte référent",
  tasks_waitingApprovalHeading: 'En attente de validation',

  stars_title: 'Étoiles',
  stars_yourStars: 'Tes étoiles',
  stars_canRedeem: 'Tu peux échanger "{title}" !',
  stars_nextReward: 'Prochaine récompense : {title}',
  stars_rewardsTitle: 'Récompenses',
  stars_noRewards: "Pas encore de récompenses. Demande à ton adulte référent d'en ajouter.",
  stars_redeem: 'Échanger',
  stars_yay: 'Youpi !',
  stars_alreadyRedeemed: 'Déjà échangées',
  stars_redeemed: 'Échangée',

  diary_title: 'Journal',
  diary_subtitle: 'Écris sur ta journée.',
  diary_addEntry: 'Ajouter une note',
  diary_noEntries: 'Pas encore de notes dans le journal',
  diary_tapAddEntry: 'Touche "Ajouter une note" pour écrire sur ta journée.',
  diaryForm_title: 'Nouvelle note',
  diaryForm_subtitle: "Qu'est-ce qui s'est passé aujourd'hui ?",
  diaryForm_placeholder: "Aujourd'hui, j'ai...",
  diaryForm_cancel: 'Annuler',
  diaryForm_save: 'Enregistrer',

  profile_title: 'Profil',
  profile_friend: 'Ami',
  profile_textSize: 'Taille du texte',
  profile_small: 'Petit',
  profile_medium: 'Moyen',
  profile_large: 'Grand',
  profile_xlarge: 'Très grand',
  profile_highContrast: 'Contraste élevé',
  profile_highContrastDesc: 'Couleurs plus fortes, plus faciles à voir',
  profile_reduceMotion: 'Réduire les animations',
  profile_reduceMotionDesc: 'Désactive les animations',
  profile_logOut: 'Se déconnecter',
  profile_language: 'Langue',

  login_title: 'Connexion',
  login_welcomeBack: 'Bon retour sur Virta7.',
  login_tutorAdmin: 'Tuteur / Admin',
  login_childsCode: "Code de l'enfant",
  login_email: 'Email',
  login_password: 'Mot de passe',
  login_logIn: 'Connexion',
  login_noAccount: 'Pas de compte ?',
  login_register: "S'inscrire",
  login_enterCode: 'Entre le code et le code PIN donnés par ton tuteur.',
  login_loginCode: 'Code de connexion',
  login_pin: 'Code PIN',
  login_enter: 'Entrer',
  login_error: 'Un problème est survenu. Le serveur fonctionne-t-il ?',

  register_title: 'Créer un compte',
  register_subtitle: "Inscris-toi comme tuteur pour gérer ton enfant, ou comme admin.",
  register_tutor: 'Tuteur',
  register_admin: 'Admin',
  register_yourName: 'Ton nom',
  register_email: 'Email',
  register_password: 'Mot de passe',
  register_adminCode: 'Code admin',
  register_createAccount: 'Créer le compte',
  register_alreadyHave: 'Tu as déjà un compte ?',
  register_logIn: 'Connexion',
  register_passwordLength: 'Le mot de passe doit contenir au moins 6 caractères.',
  register_error: 'Un problème est survenu. Le serveur fonctionne-t-il ?',

  greeting_skip: 'Passer',
  greeting_hiName: "Salut {name} ! Comment vas-tu aujourd'hui ?",
  greeting_hi: "Salut ! Comment vas-tu aujourd'hui ?",
  greeting_whatDoing: "Qu'est-ce que tu veux faire aujourd'hui ?",
  greeting_imVirtinhoName: 'Salut {name} ! Je suis Virtinho.',
  greeting_imVirtinho: 'Salut ! Je suis Virtinho.',
  greeting_andImVirtinha: 'Et moi, je suis Virtinha !',
  greeting_appIntro: "Cette application s'appelle Virta7. Laisse-nous te la faire découvrir.",
  greeting_timetableIntro: "L'Emploi du temps montre ta routine pour chaque jour.",
  greeting_tasksIntro: 'Les Tâches sont de petits travaux que tu peux faire pour gagner des étoiles.',
  greeting_starsIntro: 'Les Étoiles peuvent être échangées contre des récompenses que tu aimes.',
  greeting_diaryIntro: 'Le Journal est un endroit privé pour écrire sur ta journée.',
  greeting_missionsIntro: 'Les Missions sont des vidéos choisies juste pour toi.',
  greeting_virtaGoIntro: "Virta Go, c'est là que tu peux nous parler à tout moment.",
  greeting_pickSomething: 'Maintenant, choisissons quelque chose à faire !',
  greeting_whatWouldYouLikeToDo: 'Que voudrais-tu faire ?',
  greeting_niceGoAhead: 'Super, vas-y !',
  greeting_myTimetable: 'Mon emploi du temps',
  greeting_missions: 'Missions',
  greeting_earnStars: 'Gagner des étoiles',
  greeting_relax: 'Se détendre',

  virtago_whoChat: 'Avec qui veux-tu parler ?',
  virtago_pickFriend: 'Choisis un ami avec qui parler.',
  virtago_talkWith: 'Parler avec {name}',
  virtago_typing: '{name} est en train d\'écrire…',
  virtago_placeholder: 'Écris un message…',
  virtago_hiImName: "Salut ! Je suis {name}. À quoi penses-tu aujourd'hui ?",

  missions_title: 'Missions',
  missions_loading: 'Chargement…',
  missions_couldntLoad: "Impossible de charger les vidéos. Demande à ton tuteur de vérifier la connexion.",
  missions_noVideos: "Le tuteur n'a pas encore ajouté de vidéos.",
  missions_subtitle: 'Vidéos choisies pour toi. Touche-en une pour la regarder.',
  missions_missionOfDay: 'Mission du Jour',
  missions_missionOfDayPopupHeading: 'La Mission du Jour !',
  missions_letsGo: "C'est parti !",
};

const it: Translations = {
  nav_home: 'Home',
  nav_virta: 'Virta',
  nav_missions: 'Missioni',
  nav_timetable: 'Orario',
  nav_diary: 'Diario',
  nav_tasks: 'Attività',
  nav_stars: 'Stelle',
  nav_profile: 'Profilo',

  weekday_monday: 'Lunedì',
  weekday_tuesday: 'Martedì',
  weekday_wednesday: 'Mercoledì',
  weekday_thursday: 'Giovedì',
  weekday_friday: 'Venerdì',
  weekday_saturday: 'Sabato',
  weekday_sunday: 'Domenica',
  weekday_short_monday: 'Lun',
  weekday_short_tuesday: 'Mar',
  weekday_short_wednesday: 'Mer',
  weekday_short_thursday: 'Gio',
  weekday_short_friday: 'Ven',
  weekday_short_saturday: 'Sab',
  weekday_short_sunday: 'Dom',

  home_hello: 'Ciao,',
  home_friend: 'amico',
  home_todaysTimetable: "L'orario di oggi",
  home_seeAll: 'Vedi tutto',
  home_allDoneTitle: 'Tutto fatto per oggi!',
  home_allDoneSubtitle: 'Ottimo lavoro, hai finito la tua routine.',
  home_noRoutine: 'Non c\'è ancora una routine per oggi. Chiedi al tuo tutor di aggiungerne una.',
  home_starsTodayTitle: 'Stelle guadagnate oggi',
  home_starsTodaySubtitle: 'Continua così, stai andando benissimo!',
  home_youHaveStars: 'Hai {count} {unit} da spendere!',
  home_star: 'stella',
  home_starsPlural: 'stelle',
  home_tapRewards: 'Tocca per vedere i premi che puoi riscattare.',
  home_earnStarsTitle: 'Guadagna stelle per sbloccare premi!',
  home_tapTasks: 'Tocca per vedere le attività che puoi fare.',

  timetable_title: 'Orario',
  timetable_chooseDay: 'Scegli un giorno',
  timetable_noBlocks: 'Non ci sono ancora attività per questo giorno. Chiedi al tuo tutor di aggiungerne.',
  timetable_doneOf: '{done} di {total} completate',

  tasks_title: 'Attività',
  tasks_noTasksYet: 'Nessuna attività ancora',
  tasks_askCaregiver: 'Chiedi al tuo tutor di aggiungerne alcune.',
  tasks_subtitle: 'Completa le attività per guadagnare stelle.',
  tasks_allDone: 'Tutte le attività sono completate. Ottimo lavoro!',
  tasks_completed: 'Completata',
  tasks_waitingApproval: 'In attesa che il tuo tutor lo controlli',
  tasks_waitingApprovalHeading: 'In attesa di approvazione',

  stars_title: 'Stelle',
  stars_yourStars: 'Le tue stelle',
  stars_canRedeem: 'Ora puoi riscattare "{title}"!',
  stars_nextReward: 'Prossimo premio: {title}',
  stars_rewardsTitle: 'Premi',
  stars_noRewards: 'Non ci sono ancora premi. Chiedi al tuo tutor di aggiungerne.',
  stars_redeem: 'Riscatta',
  stars_yay: 'Evviva!',
  stars_alreadyRedeemed: 'Già riscattati',
  stars_redeemed: 'Riscattato',

  diary_title: 'Diario',
  diary_subtitle: 'Scrivi della tua giornata.',
  diary_addEntry: 'Aggiungi nota',
  diary_noEntries: 'Nessuna nota nel diario ancora',
  diary_tapAddEntry: 'Tocca "Aggiungi nota" per scrivere della tua giornata.',
  diaryForm_title: 'Nuova nota',
  diaryForm_subtitle: 'Cosa è successo oggi?',
  diaryForm_placeholder: 'Oggi io...',
  diaryForm_cancel: 'Annulla',
  diaryForm_save: 'Salva',

  profile_title: 'Profilo',
  profile_friend: 'Amico',
  profile_textSize: 'Dimensione testo',
  profile_small: 'Piccolo',
  profile_medium: 'Medio',
  profile_large: 'Grande',
  profile_xlarge: 'Molto grande',
  profile_highContrast: 'Alto contrasto',
  profile_highContrastDesc: 'Colori più forti, più facili da vedere',
  profile_reduceMotion: 'Riduci movimento',
  profile_reduceMotionDesc: 'Disattiva le animazioni',
  profile_logOut: 'Esci',
  profile_language: 'Lingua',

  login_title: 'Accedi',
  login_welcomeBack: 'Bentornato su Virta7.',
  login_tutorAdmin: 'Tutor / Admin',
  login_childsCode: 'Codice del bambino',
  login_email: 'Email',
  login_password: 'Password',
  login_logIn: 'Accedi',
  login_noAccount: 'Non hai un account?',
  login_register: 'Registrati',
  login_enterCode: 'Inserisci il codice e il PIN che ti ha dato il tuo tutor.',
  login_loginCode: 'Codice di accesso',
  login_pin: 'PIN',
  login_enter: 'Entra',
  login_error: 'Qualcosa è andato storto. Il server è attivo?',

  register_title: 'Crea un account',
  register_subtitle: 'Registrati come tutor per gestire tuo figlio, oppure come admin.',
  register_tutor: 'Tutor',
  register_admin: 'Admin',
  register_yourName: 'Il tuo nome',
  register_email: 'Email',
  register_password: 'Password',
  register_adminCode: 'Codice admin',
  register_createAccount: 'Crea account',
  register_alreadyHave: 'Hai già un account?',
  register_logIn: 'Accedi',
  register_passwordLength: 'La password deve avere almeno 6 caratteri.',
  register_error: 'Qualcosa è andato storto. Il server è attivo?',

  greeting_skip: 'Salta',
  greeting_hiName: 'Ciao {name}! Come stai oggi?',
  greeting_hi: 'Ciao! Come stai oggi?',
  greeting_whatDoing: 'Cosa vuoi fare oggi?',
  greeting_imVirtinhoName: 'Ciao {name}! Sono Virtinho.',
  greeting_imVirtinho: 'Ciao! Sono Virtinho.',
  greeting_andImVirtinha: 'E io sono Virtinha!',
  greeting_appIntro: "Questa app si chiama Virta7. Lascia che ti mostriamo come funziona.",
  greeting_timetableIntro: "L'Orario mostra la tua routine per ogni giorno.",
  greeting_tasksIntro: 'Le Attività sono piccoli lavori che puoi fare per guadagnare stelle.',
  greeting_starsIntro: 'Le Stelle possono essere scambiate con premi che ti piacciono.',
  greeting_diaryIntro: 'Il Diario è un posto privato per scrivere della tua giornata.',
  greeting_missionsIntro: 'Le Missioni sono video scelti apposta per te.',
  greeting_virtaGoIntro: 'Virta Go è dove puoi parlare con noi quando vuoi.',
  greeting_pickSomething: 'Ora scegliamo qualcosa da fare!',
  greeting_whatWouldYouLikeToDo: 'Cosa vorresti fare?',
  greeting_niceGoAhead: 'Bene, vai pure!',
  greeting_myTimetable: 'Il mio orario',
  greeting_missions: 'Missioni',
  greeting_earnStars: 'Guadagna stelle',
  greeting_relax: 'Rilassati',

  virtago_whoChat: 'Con chi vuoi parlare?',
  virtago_pickFriend: 'Scegli un amico con cui parlare.',
  virtago_talkWith: 'Parla con {name}',
  virtago_typing: '{name} sta scrivendo…',
  virtago_placeholder: 'Scrivi un messaggio…',
  virtago_hiImName: 'Ciao! Sono {name}. A cosa stai pensando oggi?',

  missions_title: 'Missioni',
  missions_loading: 'Caricamento…',
  missions_couldntLoad: 'Impossibile caricare i video ora. Chiedi al tuo tutor di controllare la connessione.',
  missions_noVideos: 'Il tutor non ha ancora aggiunto video.',
  missions_subtitle: 'Video scelti per te. Toccane uno per guardarlo.',
  missions_missionOfDay: 'Missione del Giorno',
  missions_missionOfDayPopupHeading: 'La Missione di Oggi!',
  missions_letsGo: 'Andiamo!',
};

const hu: Translations = {
  nav_home: 'Kezdőlap',
  nav_virta: 'Virta',
  nav_missions: 'Küldetések',
  nav_timetable: 'Napirend',
  nav_diary: 'Napló',
  nav_tasks: 'Feladatok',
  nav_stars: 'Csillagok',
  nav_profile: 'Profil',

  weekday_monday: 'Hétfő',
  weekday_tuesday: 'Kedd',
  weekday_wednesday: 'Szerda',
  weekday_thursday: 'Csütörtök',
  weekday_friday: 'Péntek',
  weekday_saturday: 'Szombat',
  weekday_sunday: 'Vasárnap',
  weekday_short_monday: 'Hét',
  weekday_short_tuesday: 'Ked',
  weekday_short_wednesday: 'Sze',
  weekday_short_thursday: 'Csü',
  weekday_short_friday: 'Pén',
  weekday_short_saturday: 'Szo',
  weekday_short_sunday: 'Vas',

  home_hello: 'Szia,',
  home_friend: 'barátom',
  home_todaysTimetable: 'Mai napirend',
  home_seeAll: 'Összes megtekintése',
  home_allDoneTitle: 'Mára minden kész!',
  home_allDoneSubtitle: 'Szép munka, befejezted a napirendedet.',
  home_noRoutine: 'Még nincs beállítva mai napirend. Kérd meg a gondviselődet, hogy adjon hozzá egyet.',
  home_starsTodayTitle: 'Ma szerzett csillagok',
  home_starsTodaySubtitle: 'Így tovább, nagyon jól csinálod!',
  home_youHaveStars: 'Van {count} {unit}, amit elkölthetsz!',
  home_star: 'csillagod',
  home_starsPlural: 'csillagod',
  home_tapRewards: 'Koppints, hogy lásd a beváltható jutalmakat.',
  home_earnStarsTitle: 'Szerezz csillagokat a jutalmak feloldásához!',
  home_tapTasks: 'Koppints, hogy lásd az elvégezhető feladatokat.',

  timetable_title: 'Napirend',
  timetable_chooseDay: 'Válassz egy napot',
  timetable_noBlocks: 'Erre a napra még nincsenek tevékenységek. Kérd meg a gondviselődet, hogy adjon hozzá néhányat.',
  timetable_doneOf: '{done} / {total} kész',

  tasks_title: 'Feladatok',
  tasks_noTasksYet: 'Még nincsenek feladatok',
  tasks_askCaregiver: 'Kérd meg a gondviselődet, hogy adjon hozzá néhányat.',
  tasks_subtitle: 'Végezz el feladatokat, hogy csillagokat szerezz.',
  tasks_allDone: 'Minden feladat kész. Szép munka!',
  tasks_completed: 'Elvégezve',
  tasks_waitingApproval: 'Várakozás, hogy a gondviselőd ellenőrizze',
  tasks_waitingApprovalHeading: 'Jóváhagyásra vár',

  stars_title: 'Csillagok',
  stars_yourStars: 'A csillagaid',
  stars_canRedeem: 'Már beválthatod: "{title}"!',
  stars_nextReward: 'Következő jutalom: {title}',
  stars_rewardsTitle: 'Jutalmak',
  stars_noRewards: 'Még nincsenek jutalmak. Kérd meg a gondviselődet, hogy adjon hozzá néhányat.',
  stars_redeem: 'Beváltás',
  stars_yay: 'Juhé!',
  stars_alreadyRedeemed: 'Már beváltva',
  stars_redeemed: 'Beváltva',

  diary_title: 'Napló',
  diary_subtitle: 'Írj a napodról.',
  diary_addEntry: 'Bejegyzés hozzáadása',
  diary_noEntries: 'Még nincsenek naplóbejegyzések',
  diary_tapAddEntry: 'Koppints a "Bejegyzés hozzáadása" gombra, hogy írj a napodról.',
  diaryForm_title: 'Új bejegyzés',
  diaryForm_subtitle: 'Mi történt ma?',
  diaryForm_placeholder: 'Ma én...',
  diaryForm_cancel: 'Mégse',
  diaryForm_save: 'Mentés',

  profile_title: 'Profil',
  profile_friend: 'Barátom',
  profile_textSize: 'Szövegméret',
  profile_small: 'Kicsi',
  profile_medium: 'Közepes',
  profile_large: 'Nagy',
  profile_xlarge: 'Extra nagy',
  profile_highContrast: 'Nagy kontraszt',
  profile_highContrastDesc: 'Erősebb színek, könnyebben látható',
  profile_reduceMotion: 'Mozgás csökkentése',
  profile_reduceMotionDesc: 'Kikapcsolja az animációkat',
  profile_logOut: 'Kijelentkezés',
  profile_language: 'Nyelv',

  login_title: 'Bejelentkezés',
  login_welcomeBack: 'Üdvözlünk újra a Virta7-ben.',
  login_tutorAdmin: 'Gondviselő / Admin',
  login_childsCode: 'Gyermek kódja',
  login_email: 'Email',
  login_password: 'Jelszó',
  login_logIn: 'Bejelentkezés',
  login_noAccount: 'Nincs fiókod?',
  login_register: 'Regisztráció',
  login_enterCode: 'Add meg a bejelentkezési kódot és PIN-kódot, amit a gondviselődtől kaptál.',
  login_loginCode: 'Bejelentkezési kód',
  login_pin: 'PIN-kód',
  login_enter: 'Belépés',
  login_error: 'Valami hiba történt. Fut a szerver?',

  register_title: 'Fiók létrehozása',
  register_subtitle: 'Regisztrálj gondviselőként, hogy kezeld a gyermekedet, vagy adminként.',
  register_tutor: 'Gondviselő',
  register_admin: 'Admin',
  register_yourName: 'A neved',
  register_email: 'Email',
  register_password: 'Jelszó',
  register_adminCode: 'Admin kód',
  register_createAccount: 'Fiók létrehozása',
  register_alreadyHave: 'Már van fiókod?',
  register_logIn: 'Bejelentkezés',
  register_passwordLength: 'A jelszónak legalább 6 karakterből kell állnia.',
  register_error: 'Valami hiba történt. Fut a szerver?',

  greeting_skip: 'Kihagyás',
  greeting_hiName: 'Szia {name}! Hogy vagy ma?',
  greeting_hi: 'Szia! Hogy vagy ma?',
  greeting_whatDoing: 'Mit szeretnél ma csinálni?',
  greeting_imVirtinhoName: 'Szia {name}! Én Virtinho vagyok.',
  greeting_imVirtinho: 'Szia! Én Virtinho vagyok.',
  greeting_andImVirtinha: 'Én pedig Virtinha vagyok!',
  greeting_appIntro: 'Ezt az alkalmazást Virta7-nek hívják. Megmutatjuk, hogyan működik.',
  greeting_timetableIntro: 'A Napirend mutatja a napi rutinodat.',
  greeting_tasksIntro: 'A Feladatok kis munkák, amiket elvégezhetsz csillagokért.',
  greeting_starsIntro: 'A Csillagokat olyan jutalmakra válthatod be, amiket szeretsz.',
  greeting_diaryIntro: 'A Napló egy privát hely, ahol írhatsz a napodról.',
  greeting_missionsIntro: 'A Küldetések neked válogatott videók.',
  greeting_virtaGoIntro: 'A Virta Go-ban bármikor beszélgethetsz velünk.',
  greeting_pickSomething: 'Most válasszunk valamit, amit csinálhatsz!',
  greeting_whatWouldYouLikeToDo: 'Mit szeretnél csinálni?',
  greeting_niceGoAhead: 'Szuper, csináld csak!',
  greeting_myTimetable: 'A napirendem',
  greeting_missions: 'Küldetések',
  greeting_earnStars: 'Csillagszerzés',
  greeting_relax: 'Pihenés',

  virtago_whoChat: 'Kivel szeretnél beszélgetni?',
  virtago_pickFriend: 'Válassz egy barátot, akivel beszélgethetsz.',
  virtago_talkWith: 'Beszélgetés vele: {name}',
  virtago_typing: '{name} éppen ír…',
  virtago_placeholder: 'Írj egy üzenetet…',
  virtago_hiImName: 'Szia! Én {name} vagyok. Mi jár a fejedben ma?',

  missions_title: 'Küldetések',
  missions_loading: 'Betöltés…',
  missions_couldntLoad: 'Most nem sikerült betölteni a videókat. Kérd meg a gondviselődet, hogy ellenőrizze a kapcsolatot.',
  missions_noVideos: 'A gondviselőd még nem adott hozzá videókat.',
  missions_subtitle: 'Neked válogatott videók. Koppints egyre a megtekintéshez.',
  missions_missionOfDay: 'A Nap Küldetése',
  missions_missionOfDayPopupHeading: 'A Mai Küldetés!',
  missions_letsGo: 'Gyerünk!',
};

export const TRANSLATIONS: Record<LocaleCode, Translations> = {
  'en-US': enUS,
  'en-GB': enGB,
  'pt-PT': ptPT,
  'pt-BR': ptBR,
  es,
  no,
  fr,
  it,
  hu,
};
