async function TryYourLuck() {
  const revolverImage = document.querySelector(".russian-roulette img");
  const button = document.querySelector(".russian-roulette button");
  const text = document.querySelector(".russian-roulette p");
  const originalText = button.textContent;
  revolverImage.classList.add("spin");
  button.disabled = true;

  await new Promise((resolve) => {
    revolverImage.addEventListener("animationend", resolve, { once: true });

    setTimeout(resolve, 1100);
  });

  revolverImage.classList.remove("spin");

  const bulletPosition = Math.floor(Math.random() * 6);
  const playerPosition = Math.floor(Math.random() * 6);

  if (bulletPosition === playerPosition) {
    text.textContent = "BANG!";
    button.style.backgroundColor = "red";
    await sleep(2000);
    window.open("https://www.youtube.com/watch?v=xvFZjo5PgG0", "_blank");
  } else {
    text.textContent = "You got lucky!";
    button.style.backgroundColor = "green";
    await sleep(1000);
  }

  button.disabled = false;
  text.textContent = originalText;
  button.style.backgroundColor = "";
}

function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
