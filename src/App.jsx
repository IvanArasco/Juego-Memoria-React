import { useState , useEffect } from 'react';
import './App.css';

function App() {

  const cards = [
    { id: 1, imageSrc: '/images/paisaje01.webp', dorso: '/images/dorso.webp', flipped: true },
    { id: 2, imageSrc: '/images/paisaje02.webp', dorso: '/images/dorso.webp', flipped: true  },
    { id: 3, imageSrc: '/images/paisaje03.webp', dorso: '/images/dorso.webp', flipped: true  },
    { id: 4, imageSrc: '/images/paisaje04.webp', dorso: '/images/dorso.webp', flipped: true  },
  ];

  // Crear las cartas duplicadas y mezclarlas
  const duplicatedCards = [...cards];
  const shuffledCards = [...cards, ...duplicatedCards].sort(() => 0.5 - Math.random());

  // Estados
  const [gameCards, setGameCards] = useState(shuffledCards);
  const [flippedCards, setFlippedCards] = useState([]); // Guardar las cartas volteadas

  const [lockedFlip, lockedFlipCards] = useState(false); // Estado para bloquear el clic durante la evaluación

  // Voltear todas las cartas después de 3 segundos
  useEffect(() => {
    const flipAllCardsTimeout = setTimeout(() => {
      setGameCards((cards) =>
        cards.map((card) => ({ ...card, flipped: false }))
      );
    }, 3000);

    return () => clearTimeout(flipAllCardsTimeout); // Limpiar timeout al desmontar
  }, []);

  // Manejar clics en las cartas
  const handleCardClick = (index) => {
    const clickedCard = gameCards[index];

    if (clickedCard.flipped || lockedFlip) return; // Si ya se había volteado o estamos esperando a que se limpien las volteadas

    clickedCard.flipped = true; // Voltear la carta

    setFlippedCards((prevCards) => {
      const newFlippedCards = [...prevCards, clickedCard];

      // Evaluar si hay dos cartas volteadas
      if (newFlippedCards.length === 2) {
        lockedFlipCards(true);

        console.log("Cartas volteadas: ", newFlippedCards);

        // Comprobación de si las cartas coinciden
        if (newFlippedCards[0].imageSrc === newFlippedCards[1].imageSrc) {
          // Si coinciden, ocultarlas mediante la propiedad hidden
          setTimeout(() => {
          setGameCards((prevCards) =>
            prevCards.map((card) =>
              card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id
                ? { ...card, hidden: true }
                : card
            )
          );
          setFlippedCards([]); // Limpiar flippedCards después de la comparación exitosa
          lockedFlipCards(false);
        }, 2000);
        } else {
          // Si no coinciden, revertir las cartas
          setTimeout(() => {
            setGameCards((prevCards) =>
              prevCards.map((card) =>
                card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id
                  ? { ...card, flipped: false }
                  : card
              )
            );
            // Limpiar flippedCards después de revertir las cartas
            setFlippedCards([]);
            lockedFlipCards(false);
          }, 2000); // Espera 1 segundo antes de revertir las cartas
        }
      }
      // Retornar el nuevo estado de flippedCards
      return newFlippedCards;
    });
  };

  return (
    <>
      <h1>Juego Memoria</h1>

      <div className="gameArea">  
        {
          gameCards.map((card, index) => ( 
            <div className={`card ${card.hidden ? "hidden" : ''}`} key={index}>
              <a href="#" onClick={() => handleCardClick(index)}>
                <img src={card.flipped ? card.imageSrc : card.dorso} alt={`Paisaje ${card.id}`} />
                <p>{card.id}</p> {/* Si el ID coincide, son parejas */}
              </a>
            </div>
          ))
        }
      </div>

      <div className="buttons">
        <button id="btnStart" name="Empezar partida">Empezar partida</button>
        <button id="btnRestart" name="Reiniciar partida">Reiniciar partida</button>
      </div>
    </>
  );
}

export default App;
