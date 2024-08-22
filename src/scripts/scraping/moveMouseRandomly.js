const delay = require("./delay");

async function moveMouseRandomly(page) {
    // Obtém as dimensões da página
    const viewport = page.viewport();

    // Número de movimentos que o mouse fará em cada chamada da função
    const steps = Math.floor(Math.random() * 5) + 5; // Movimenta entre 5 e 10 vezes

    for (let i = 0; i < steps; i++) {
        // Gera posições aleatórias dentro da área visível da página
        const randomX = Math.floor(Math.random() * viewport.width);
        const randomY = Math.floor(Math.random() * viewport.height);

        // Move o mouse para a posição aleatória gerada
        await page.mouse.move(randomX, randomY);

        // Log para depuração (opcional)
        console.log(`Mouse moved to: (${randomX}, ${randomY})`);

        // Adiciona um pequeno atraso entre os movimentos para simular um movimento mais suave
        await delay(Math.random() * 500 + 200);

    }

    // Decide aleatoriamente se o mouse deve clicar em um dos elementos após o movimento
    if (Math.random() < 0.2) { // 20% de chance de clicar
        const elementToClick = Math.random() < 0.5 ? '#APjFqb' : '.z1asCe.SaPW2b';

        // Verifica se o elemento existe e clica
        const element = await page.$(elementToClick);
        if (element) {
            const box = await element.boundingBox();
            if (box) {
                await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                console.log(`Mouse clicked on element: ${elementToClick}`);
            }
        }
    }
}

module.exports = moveMouseRandomly;
