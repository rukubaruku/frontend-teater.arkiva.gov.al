import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const PopUp = ({ open, setOpen, header, content, deleteFunction }) => {
  return (
    <Popup open={open} onClose={() => setOpen(false)} modal>
      <div className="pop-up">
        <div className="pop-up-icon">
          <i className="fa-regular fa-circle-xmark"></i>
        </div>
        <div className="pop-up-header">{header}</div>
        <div className="pop-up-content">{content}</div>
        <div className="pop-up-actions">
          <button className="anulla" onClick={() => setOpen(false)}>
            Anullo
          </button>
          <button
            className="confirm-delete"
            onClick={() => {
              deleteFunction();
              setOpen(false);
            }}
          >
            Konfirmo
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default PopUp;
