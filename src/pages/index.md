---
    author : John Haugeland <stonecypher@gmail.com>;
    title  : Welcome to We Should Learn;
    target : index.html;
...

# Welcome to We Should Learn

This is a test.

```javascript
// the nonsense from wikipedia
var x = 0; // A global variable, because it is not in any function

function f() {
  var z = 'foxes', r = 'birds'; // 2 local variables
  m = 'fish'; // global, because it wasn't declared anywhere before

  function child() {
    var r = 'monkeys'; // This variable is local and does not affect the "birds" r of the parent function.
    z = 'penguins'; // Closure: Child function is able to access the variables of the parent function.
  }

  twenty = 20; // This variable is declared on the next line, but usable anywhere in the function, even before, as here
  var twenty;

  child();
  return x; // We can use x here, because it is global
}

f();

alert(z); // This line will raise a ReferenceError exception, because the value of z is no longer available
```

and

```sql
SELECT b.isbn, b.title, b.price, sales.items_sold, sales.company_nm
FROM Book b
  JOIN (SELECT SUM(Items_Sold) Items_Sold, Company_Nm, ISBN
        FROM Book_Sales
        GROUP BY Company_Nm, ISBN) sales
  ON sales.isbn = b.isbn
```

Hooray!