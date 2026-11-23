# Prova #356 — fila de denúncias em navegador real

`node scripts/prova-356.mjs` monta a seção com a fixture pública, abre no Chrome headless via CDP
e confere o comportamento no DOM real:

- `pending`: o clique no voto não chega ao chamador.
- Sem `pending`: o voto chega e o cartão votado sai da fila.
- Depois da remoção, o foco vai para o título da seção (`h2`).
- O filtro por motivo "Golpe" reduz a contagem do recorte ("1 de 2").

A saída da última execução está em `prova.txt`.
