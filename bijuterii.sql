DROP TYPE IF EXISTS categorii_produse;
DROP TYPE IF EXISTS tipuri_bijuterii;
DROP TYPE IF EXISTS tip_metal;

CREATE TYPE categorii_produse AS ENUM( 'bijuterii', 'accesorii pentru bijuterii');
CREATE TYPE tipuri_bijuterii AS ENUM('bratari', 'coliere', 'cercei','talismane', 'pandantive');
CREATE TYPE tip_metal AS ENUM('aur','argint','otel inoxidabil');

CREATE TABLE IF NOT EXISTS bijuterii (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   categorie categorii_produse,
   tip_produs tipuri_bijuterii,
   pret NUMERIC(8,2) NOT NULL,
   gramaj INT NOT NULL CHECK (gramaj>=0),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   material tip_metal,
   pietreincluse VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   impachetare_cadou BOOLEAN NOT NULL DEFAULT FALSE--produsul vine sa nu impachetat pentru cadou
);

INSERT into bijuterii (nume, descriere, imagine, categorie, tip_produs, pret, gramaj, material, pietreincluse, impachetare_cadou) VALUES 
('Bratara eleganta', 'Bratara din aur cu detalii stralucitoare','bratara1.jpg', 'bijuterii' , 'bratari', 100, 10, 'aur', '{"diamante"}', False),
('Colier din argint', 'Colier elegant', 'colier1.jpg', 'bijuterii', 'coliere', 80, 15, 'argint', NULL, TRUE),
('Cercei cu perle', 'Cercei din aur cu perle naturale', 'cercei1.jpg', 'bijuterii', 'cercei', 120, 5, 'aur', '{"perle"}', FALSE),
('Talisman cu simbolul infinitului', 'Talisman din argint cu simbolul infinitului', 'talisman1.jpg', 'accesorii pentru bijuterii', 'talismane', 50, 3, 'argint', NULL, TRUE),
('Pandantiv cu piatra lunii', 'Pandantiv din aur cu piatra lunii', 'pandantiv1.jpg', 'accesorii pentru bijuterii', 'pandantive', 90, 7, 'aur', '{"piatra lunii"}', FALSE),
('Pandantiv inimioara', 'Pandantiv din aur in forma de inimioara', 'pandantivv2.jpg', 'accesorii pentru bijuterii', 'pandantive', 70, 8, 'aur', NULL, TRUE),
('Colier cu cristale swarovski', 'Colier elegant cu cristale swarovski', 'colier2.jpg', 'bijuterii', 'coliere', 110, 12, 'otel inoxidabil', '{"cristale swarovski"}', FALSE),
('Cercei cu diamante', 'Cercei din aur cu diamante naturale', 'cercei2.jpg', 'bijuterii', 'cercei', 200, 6, 'aur', '{"diamante"}', TRUE),
('Talisman cu simbolul florii vietii', 'Talisman din argint cu simbolul florii vietii', 'talisman2.jpg', 'accesorii pentru bijuterii', 'talismane', 40, 4, 'argint', NULL, TRUE),
('Pandantiv cu piatra ametist', 'Pandantiv din aur cu piatra ametist', 'pandantiv2.jpg', 'accesorii pentru bijuterii', 'pandantive', 75, 9, 'aur', '{"piatra ametist"}', FALSE),
('Bratara cu inele', 'Bratara din aur cu inele interschimbabile', 'bratara3.jpg', 'bijuterii', 'bratari', 150, 10, 'aur', NULL, FALSE),
('Colier cu perla', 'Colier elegant cu perla', 'colier3.jpg', 'bijuterii', 'coliere', 95, 14, 'otel inoxidabil', '{"perla"}', TRUE),
('Bratara cu simboluri celeste', 'Bratara stralucitoare cu detalii fine', 'bratara4.jpg', 'bijuterii', 'bratari', 150, 5, 'aur', '{"diamante"}', FALSE),
('Cercei cu semiluna', 'Cercei din argint cu semiluna', 'cercei4.jpg', 'bijuterii', 'cercei', 135, 3, 'argint', NULL, TRUE),
('Colier simplu', 'Colier simplu perfect ca suport pentru talisman', 'colier4.jpg', 'bijuterii', 'coliere', 100, 4, 'aur', NULL, FALSE);
