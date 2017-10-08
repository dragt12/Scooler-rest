Hack-heroes website api/REST created by Jakub Mularski.
GET routes:
'/school/generate/:szkola': ':szkola'-parametr odpowiedzialny za nazwe szkoły. Zwraca kod szkoły, hasło szkoły w jsonie o podanym wyglądzie:
{'school_code':kod_szkoły, 'school_pass':hasło_szkoły}. W przypadku istnienia szkoły o podanej nazwie zwraca status 500.
POST routes:
'/teacher/generate_codes': Wymagane parametry: json o podanym wygladzie: {'id':'id_nauczyciela',"students":["imie_nazwisko1", "imie_nazwisko2" ,"imie_nazwisko3"]}
Zwraca imiona, kody, oraz hasła uczniów wymagane do pierwszego logowania w tablicy jsonów o podanym wyglądzie: [{"name":"imie_nazwisko","login_code":"kod_logowania","login_pass":"hasło_logowania"}]
'/teacher/register': Wymagane parametry: json o podanym wygladzie: {'email':'email_uzytkownika', 'password':'hasło', 'school_id':'kod_szkoły', 'school_pass':'hasło_szkoły'}
W przypadku pomyślnego zarejestrowania zwraca kod 200 oraz jsona o podanym wyglądzie:{'id': 'id_uzytkownika', 'email': 'email_uzytkownika'}.
W przypadku niepomyślnego zarejerestrowania zwraca kod 401.
'/teacher/login': Wymagane parametry: json o podanym wygladzie: {'email':'email_uzytkownika', 'password':'haslo_uzytkownika'}.
W przypadku pomyślnego zalogowania zwraca kod 200 oraz jsona o podanym wyglądzie:{'id': 'id_uzytkownika', 'email': 'email_uzytkownika'}.
W przypadku niepomyślnego zalogowania zwraca kod 401.
