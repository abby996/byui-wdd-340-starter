USE v_art;
-- 1 Insert artist
INSERT INTO artist (fname, mname, lname, dob, dod, country, local)
VALUES (
        'Johannes',
        NULL,
        'Vermeer',
        1632,
        1674,
        'Netherlands',
        'n'
    );
-- 2 Virtual gallery , a list
SELECT fname,
    mname,
    lname,
    dob,
    dod,
    country,
    local
FROM artist
ORDER BY lname ASC;
-- 3 update dob
UPDATE artist
SET dob = '1675'
WHERE artist_id = 10;
-- 4 Delete artist in database
DELETE FROM artist
WHERE artist_id = 10;
-- Step 2
USE bike;
-- 5 Houston races
SELECT first_name,
    last_name,
    phone
FROM customer
WHERE city = 'Houston'
    AND state = 'Tx';
-- 6 Bi8ke over 5000$
SELECT product_name,
    list_price,
    list_price -500 AS 'Discount price'
FROM product
WHERE list_price >= '5000'
OrDER BY list_price DESC;
-- 7 staff
SELECT first_name,
    last_name,
    email
FROM staff
WHERE store_id <> 1;
-- 8 A customer needs more information about a specific bike
SELECT product_name,
    model_year,
    list_price
FROM product
WHERE product_name REGEXP 'spider';
-- 9 Bike's from $500 to $550
SELECT product_name,
    list_price
FROM product
WHERE list_price BETWEEN 500 AND 550
ORDER BY list_price ASC;
-- 10 Bike Results
SELECT first_name,
    last_name,
    phone,
    street,
    city,
    state,
    zip_code
FROM customer
WHERE phone IS NOT NULL
    AND (
        city REGEXP 'ach|och'
        OR last_name REGEXP 'William'
    )
LIMIT 5;
-- 11 Bike Products Without Year
SELECT (
        SUBSTRING_INDEX(
            product_name,
            ' ',
            LENGTH(product_name) - LENGTH(REPLACE(product_name, ' ', '')) - 1
        )
    ) As 'Product Name without year'
FROM product
ORDER BY product_id
LIMIT 14;
-- 12  take the 2019 model bike
SELECT product_name,
    CONCAT('$', FORMAT(list_price / 3, 2)) AS 'One of 3 payments'
FROM product
WHERE product_name REGEXP '2019';
-- Step 3 Magazine database
-- 13 List the magazine name
USE magazine;
SELECT magazineName,
    FORMAT (magazineprice * 100 / 3, 2) AS '3% off'
FROM magazine;






USE v_art;

-- 1
SELECT artfile
FROM artwork
WHERE period = 'Impressionism';
-- 2
SELECT artfile
FROM artwork
WHERE artdescription = 'flower';

-- 3
SELECT a.fname, a.lname, artwork.title
FROM artist a
JOIN artwork ON a.artist_id = artwork.artist_id;

-- 4
USE magazine;
SELECT 
    m.magazineName, s.subscriberLastName, s.subscriberFirstName
FROM subscription sub
JOIN 
    magazine m ON sub.magazineKey = m.magazineKey
JOIN 
    subscriber s ON sub.subscriberKey = s.subscriberKey
ORDER BY m.magazineName;

-- 5 
SELECT  m.magazineName
FROM subscription sub
JOIN magazine m ON  sub.magazineKey = m.magazineKey
JOIN 
    subscriber s ON sub.subscriberKey = s.subscriberKey

WHERE subscriberFirstName ='samantha'
;
-- 6
SELECT  
FROM subscription sub
JOIN magazine m ON  sub.magazineKey = m.magazineKey
JOIN 
    subscriber s ON sub.subscriberKey = s.subscriberKey

WHERE subscriberFirstName ='samantha';

USE employees;

SELECT e.first_name, e.last_name
FROM employees e
JOIN dept_emp de ON e.emp_no = de.emp_no
JOIN departments d ON de.dept_no = d.dept_no
WHERE d.dept_name = 'Customer Service'
ORDER BY e.last_name ASC
LIMIT 5;

-- 7

SELECT e.first_name, e.last_name, d.dept_name, s.salary, s.from_date

FROM employees e
JOIN salaries s ON e.emp_no = s.emp_no
JOIN dept_emp de ON e.emp_no = de.emp_no
JOIN departmentS d ON de.dept_no = d.dept_no
WHERE e.first_name = 'Berni' AND e.last_name = 'Genin'
ORDER BY from_date DESC
LIMIT 1; 

-- 8




















