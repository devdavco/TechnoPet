USE technopet_db;


-- select * from usuarios;
INSERT INTO usuarios (nombre, email, contrasena, rol, num_telefono) VALUES
('Laura Gómez',    'laura.gomez@mail.com',    'laura123',  'ADMIN',     '3001234567'),
('Carlos Pérez',   'carlos.perez@mail.com',   'carlos123', 'COMPRADOR', '3109876543'),
('Ana Martínez',   'ana.martinez@mail.com',   'ana123',    'COMPRADOR', '3204567890'),
('Jorge Ramírez',  'jorge.ramirez@mail.com',  'jorge123',  'COMPRADOR', '3157654321'),
('Valentina Ruiz', 'valentina.ruiz@mail.com', 'vale123',   'COMPRADOR', NULL);

-- Mismo orden que data/categories.json para conservar los ids (1 a 4)
INSERT INTO categorias (nombre, descripcion, imagen) VALUES
('Juguetes y entretenimiento', 'Juguetes interactivos, mordedores, pelotas y peluches para entretener, estimular y ejercitar a tu mascota.', NULL),
('Alimentación', 'Comida, snacks, comederos, bebederos y dispensadores automáticos para una nutrición completa y práctica.', NULL),
('Vigilancia y monitoreo', 'Cámaras, collares GPS y dispositivos inteligentes para saber dónde está y cómo se encuentra tu mascota en todo momento.', NULL),
('Higiene y salud', 'Productos de limpieza, cuidado del pelaje, antiparasitarios y suplementos para mantener a tu mascota sana y limpia.', NULL);

-- Precios en pesos colombianos (COP), sin decimales. Mismo orden que data/productos.json (ids 1 a 10)
INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, imagen) VALUES
(2, 'Comedero Inteligente Pro', 'Dispensador automático de comida para perros antiobstrucciones de fácil configuración, cámara transparente HD de 1080P.', 284800, 42, 'https://i0.wp.com/cat-oh.com/wp-content/uploads/2026/01/Comedero-Automatico-Yumshare-Dual-Hopper-2-con-camara_Principal.webp'),
(3, 'Collar GPS GeoTrack', 'Collar inteligente con geolocalización en tiempo real para mantener segura y vigilada a tu mascota.', 188800, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVP997UQz7eN6dJduU-h2cJG64be9ZjryueGLrueU5fLRC-jnFHQXf7vw&s=10'),
(2, 'Fuente PureFlow IoT', 'Fuente de agua inteligente con sistema de filtrado avanzado y recordatorios de nivel de agua mediante IoT.', 144000, 65, 'https://http2.mlstatic.com/D_NQ_NP_820986-MCO110756844742_052026-O.webp'),
(3, 'Cámara PetCam 360', 'Cámara de vigilancia con movimiento de 360 grados, visión nocturna y audio bidireccional para mascotas.', 252800, 19, 'https://media.falabella.com/sodimacCO/641689/public'),
(4, 'Monitor de Salud PetBand', 'Banda inteligente para monitorear la actividad física, el sueño y constantes vitales de tu mascota.', 124800, 0, 'https://petpace.com/wp-content/uploads/2026/05/PetPace-Blog-Banner-53-768x432.png'),
(1, 'Rascador Interactivo Smart', 'Rascador con elementos interactivos y sensores de movimiento para estimular el juego en gatos.', 110400, 15, 'https://media.doitcenter.com.pa/media/catalog/product/5/2/528ki04091_ehbkmq210yiviaud.jpg'),
(1, 'Juguete Laser Automatizado', 'Dispositivo láser automático con patrones de movimiento aleatorios para mantener entretenido a tu gato.', 79968, 8, 'https://s.alicdn.com/@sc04/kf/He256fe445ea44d5fbd29aef0db29df7fj/Upgrade-Automatic-Boredom-Buster-Cat-Laser-Toy-Rechargeable-Interactive-Real-Random-Trajectory-Pointer-Simple-Style-New.jpg_300x300.jpg'),
(2, 'Bebedero Térmico IoT', 'Bebedero inteligente con control de temperatura para mantener el agua fresca en cualquier clima.', 159968, 25, 'https://media.falabella.com/falabellaCO/157590790_02/w=1500,h=1500,fit=cover'),
(3, 'Puerta Inteligente RFID', 'Puerta automática que se desbloquea con el collar RFID de tu mascota para acceso controlado.', 380800, 5, 'https://m.media-amazon.com/images/I/71oJ9HXbyYL._AC_UF894,1000_QL80_.jpg'),
(4, 'Cama Climatizada Smart', 'Cama inteligente con sensores de temperatura para regular el calor y confort óptimo de tu mascota.', 304000, 12, 'https://s.alicdn.com/@sc04/kf/H702b84aba1844552b3ee73fb8cf44986X/OEM-ODM-Intelligent-Temperature-Control-Pet-Bed-Adjustable-Heating-Cooling-Dog-Sleeping-Bed-for-Medium-Large-Dogs.jpg');

INSERT INTO pedidos (usuario_id, fecha, estado) VALUES
(2, '2026-11-01 10:15:00', 'ENTREGADO'),
(3, '2026-11-05 14:30:00', 'ENVIADO'),
(4, '2026-11-08 09:00:00', 'PAGADO'),
(2, '2026-11-10 18:45:00', 'PENDIENTE'),
(5, '2026-11-11 12:20:00', 'CANCELADO');

INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 2, 284800),
(1, 3, 1, 144000),
(2, 4, 1, 252800),
(3, 7, 3, 79968),
(4, 10, 1, 304000),
(5, 6, 1, 110400);
