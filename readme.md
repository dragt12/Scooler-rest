# SCOOLER
______________  

API/REST dla projektu Schooler przygotowane przez Jakuba Mularskiego na konkurs hack-heroes. Repozytorium oraz cały projekt publikowany jest na zasadach licencji MIT.
______________  
## GET routes:    
#### '/school/school_generate/:school':  
Wymagane parametry: ':school' - nazwa szkoły.  
Generuje kod szkoły i hasło szkoły. Zwraca json o postaci: 
```
{
  "school_key":'klucz_szkoly', 
  "school_pass":'haslo_szkoly'
}
```  
#### 'school/teacher_generate/:school_key/:teachers':  
Wymagane parametry: ':school_key' - klucz szkoły, 'teachers' - array z imionami i nazwiskami nauczycieli np. ["Marcin Michno", "Arek Słowik"].  
Zwraca array jsonów o podanym wyglądzie: 
```
{
  'teacher_name': 'imie_nazwisko_nauczyciela', 
  'key_code':'klucz_nauczyciela', 
  'key_pass': 'haslo_nauczyciela'
}
```  
#### '/class/show/:name/:schoolId':  
Wymagane parametry: ':name' - imie nauczyciela, ':schoolId' - klucz szkoły.   
Zwraca wszystkie klasy które mają przypisane nauczyciela o danym id w jsonie: ```{'classes':['array_z_klasami']}```  
#### '/class/create/:className/:schoolId':  
Wymagane parametry: ':className' - nazwa klasy którą chcemy utworzyć, ':schoolId' - klucz szkoły do której przypisujemy klasę.  
Tworzy klasę w bazie danych, zwraca kod 200.  
#### '/class/setTeacher/:name/:schoolId/:className':
Wymagane parametry: ":name" - imie nauczyciela, ':schoolId' - klucz szkoly, ":className" - nazwa klasy.  
Przyporządkowuje nauczyciela do danej klasy, zwraca kod 200.
#### '/class/removeTeacher/:name/:schoolId/:className':  
Wymagane parametry: ":name" - imie nauczyciela, ':schoolId - klucz szkoly,  ":className" - nazwa klasy.  
Odpisuje nauczyciela do danej klasy, zwraca kod 200.  
#### '/class/remove/:name/:className/:schoolId':  
Wymagane parametry: ":name" - array imion nauczycieli, ":className" - nazwa klasy, ':schoolId' - klucz szkoły w której klasa jest zapisana.  
Usuwa daną klasę odpisując od niej nauczyciela, zwraca kod 200.  
#### '/class/get/:className/:schoolId':  
Wymagane parametry: ':className' - nazwa klasy, ':schoolId' - klucz szkoły do której przypisujemy klasę. 
Wyszukuje klasę o podanych parametrach, zwraca json o podanym wyglądzie: 
```
{  
    "school": "kod_szkoły",  
    "class_name": "nazwa_klasy",  
    "students": ["uczniowie"]  
}
```
#### '/school/classes/:schoolId':  
Wymagane parametry: ':schoolId' - klucz szkoly.
Zwraca wszystkie klasy w podanym formacie json: 
    ```
{
  "classes": [  
    {  
      "school": "klucz_szkoly",  
      "class_name": "nazwa_klasy",  
      "students": ['uczniowie']  
    },  
  ]
}
    ```
#### '/school/teachers/:schoolId':  
Wymagane parametry: ':schoolId' - klucz szkoly.  
Zwraca wszystkich nauczycieli danej szkoly.  
#### '/school/teacher/unregistered/:schoolId':  
Wymagane parametry: ':schoolId' - klucz szkoły.  
Zwraca json o podanym wyglądzie:   
```    
{
  name:'imie',  
  key_code:'kod_nauczyciela',  
  key_pass:'hasło_nauczyciela',  
  key_type:'teacher',  
  school:'klucz_szkoly'
}
```
#### '/school/unregister/:name/:schoolId':  
Wymagane parametry: ':name' - imie nauczyciela, ':schoolId' - klucz szkoły.  
Kasuje niezarejestrowanego nauczyciela.  
#### '/student/addPoints/:name/:class/:schoolId':  
Wymagane parametry: ':name' - imie ucznia, ':class' - nazwa klasy, ':schoolId' - klucz szkoły.  
Dodaje punkty uczniowi.  
#### '/student/minusPoints/:name/:class/:schoolId':  
Wymagane parametry: ':name' - imie ucznia, ':class' - nazwa klasy, ':schoolId' - klucz szkoły.  
Odejmuje punkty uczniowi.  
#### '/student/points/:class/:schoolId':  
Wymagane parametry: ':class' - nazwa klasy, ':schoolId' - klucz szkoły.  
Zwraca array jsonów o podanym wyglądzie:
```
{
  "name":"imie_nazwisko", 
  "points":"punkty"}
}
```
#### '/game/upgrade/:buildingName/:id':  
Wymagane parametry: ":buildingName" - 1 z 4 budynków: "cantine" - stołówka, "director" - pokoj dyrektora, "teachers_room" - pokoj nauczyciela,  "class" - klasa, ':id' - id ucznia.  
Zwraca status 200 w przypadku powodzenia ulepszenia lub 600 w przypadku niepowodzenia.  
#### '/game/data/:id':  
Wymagane parametry: ':id' - id ucznia.  
Zwraca json w postaci 
```
{
  'trophy':trofea, 
  'points':punkty, 
  'buildings':[
    {
     budynek:koszt, 
    'buildable':czy_mozna_zbudowac
    }
  ],
  'exp':exp,
  'lvl':lvl
}
``` 
W parametrze buildings w kazdym jsonie klucz to nazwa budynku a wartosc to -1 gdy nie mozemy zbudowac budynku lub koszt budowy gdy mozemy go zbudowac.  
#### '/game/ranking/:field/:schoolId':
Potrzebne argumenty: ':field' - pole do posortowania, ':schoolId' - klucz szkoly.
Zwraca json uczniów danej szkoły posortowany malejąco po parametrze ':field'.  
#### '/game/ranking/:field/:className/:schoolId':  
Potrzebne argumenty: ':field' - pole do posortowania, ':className' - nazwa klasy, ':schoolId' - klucz szkoly.  
Zwraca json uczniów danej klasy w danej szkole posortowany malejąco po parametrze ':field'.  
### LOGIKA GRY:  
Potrzebne pkt: ```lvl_budynku*2+2```   
Trofea naliczane są codziennie o północy.  
Liczba trofeów jest zależna od liczby uczniów, oraz poziomu rozbudowy stołówki oraz pokoju nauczycieli w stosunku do poziomu rozbudowy klasy.  
Liczba uczniów: ```lvl_klasy*10+20```
## POST routes:  
#### '/register/teacher':  
Wymagane parametry: json o podanym wyglądzie: 
```
{
  'email': 'email', 
  'password': 'haslo', 
  'school_id': 'klucz_nauczyciela', 
  'school_pass': 'hasło_nauczyciela'
}.
```  
Scieżka rejestrowania dla nauczyciela. Zwraca json o podanym wyglądzie: 
```
{
  'id': 'id_nauczyciela', 
  'email': 'email', 
  'name':'imie_nazwisko'
}
```
#### '/register/student':  
Wymagane parametry: json o podanym wyglądzie: 
```
{
  'email': 'email', 
  'password': 'haslo', 
  'key_code': 'klucz_ucznia', 
  'key_pass': 'hasło_ucznia'
}
```
Zwraca json z wszystkimi parametrami ucznia.
#### '/login/student':  
Wymagane parametry: json o podanym wyglądzie: 
```
{
  'email': 'email', 
  'password': 'haslo'
}
```
Zwraca json z wszystkimi parametrami ucznia.
#### '/login/teacher':  
Wymagane parametry: json o podanym wyglądzie: 
```
{
  'email': 'email',
  'password': 'haslo'
}
```
Login path dla nauczyciela. Zwraca json o podanym wygladzie: 
```
{
  'name': 'imie_nauczyciela',
  'school': 'kod_szkoly_nauczyciela'
}
```
#### '/login/admin':  
Wymagane parametry: json o podanym wyglądzie: 
```
{
  'key_code': 'klucz_szkoly', 
  'key_pass': 'haslo_szkoly'
}
```  
Login path dla dyrektora. Zwraca json o podanym wygladzie:  
```
{    
    "school_id": "klucz_szkoły",  
}  
```
#### '/class/changeStudents':  
Wymagane parametry: json o podanym wyglądzie: 
```
{
  'class_name': 'nazwa_klasy', 
  'key_code': 'klucz_szkoly', 
  'students':['lista_uczniow']
}
```
Zwraca array jsonow o podanym wygladzie: 
```
{
  'name': 'imie_nazwisko', 
  'login_code':'klucz_ucznia',   
  'login_pass':'haslo_ucznia'
}
```



