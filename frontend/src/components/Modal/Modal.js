import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from 'react';

export default function MyVerticallyCenteredModal({
  show,
  onHide,
  quarto,
  alterarContador,
  quantMaxQuartosFumante,
  quantMaxQuartosFrente
}) {
  if (!quarto) return null;

  return (
    <Modal show={show} onHide={onHide} size="md" centered>

      <Modal.Header closeButton>
        <Modal.Title>
          Opções para {quarto.tipo}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <p>Fumante</p>
        <Button
          onClick={() => alterarContador(quarto.tipo, -1, 'fumante')}
          disabled={!quantMaxQuartosFumante?.[quarto.tipo]}
        >-</Button>

        <p>{quarto.contadorFumante}</p>

        <Button
          onClick={() => alterarContador(quarto.tipo, 1, 'fumante')}
          disabled={!quantMaxQuartosFumante?.[quarto.tipo]}
        >+</Button>

        <p>Frente</p>
        <Button
          onClick={() => alterarContador(quarto.tipo, -1, 'frente')}
          disabled={!quantMaxQuartosFrente?.[quarto.tipo]}
        >-</Button>

        <p>{quarto.contadorFrente}</p>

        <Button
          onClick={() => alterarContador(quarto.tipo, 1, 'frente')}
          disabled={!quantMaxQuartosFrente?.[quarto.tipo]}
        >+
        </Button>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
