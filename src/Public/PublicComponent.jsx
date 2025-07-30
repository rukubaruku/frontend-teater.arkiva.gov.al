import "./publicComponent.css";
import Logo from "../Assets/Images/logo.jpg";
const PublicComponent = () => {
  return (
    <div className="booking">
      <div className="overlay"></div>
      <div className="booking-container">
        <div className="booking-form-container">
          <div className="booking-form">
            <div className="form-title">Rezervoni vendin tuaj</div>
            <div className="form-inputs">
              <div className="input-group">
                <div className="input-label">
                  Zgjidhni eventin që doni të ndiqni:
                </div>
                <div className="input-value">
                  <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div className="error-message"></div>
              </div>
              <div className="input-group">
                <div className="input-label">Emër Mbiemër:</div>
                <div className="input-value">
                  <input type="text" />
                </div>
                <div className="error-message"></div>
              </div>
              <div className="input-group">
                <div className="input-label">Email:</div>
                <div className="input-value">
                  <input type="text" />
                </div>
                <div className="error-message"></div>
              </div>
              <div className="input-group">
                <div className="input-label">Numri i biletave:</div>
                <div className="input-value">
                  <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="error-message"></div>
              </div>
              <div className="send-btn">
                <button>Dërgo</button>
              </div>
            </div>
          </div>
        </div>
        <div className="description">
          <div className="description-image">
            <img src={Logo} alt="dpa logo" />
          </div>
          <div className="description-title">Teatri / Kinemaja verore</div>
          <div className="description-content">
            <p>
              Pas një sezoni të parë të suksesshëm dhe të ngrohtë, Kinemaja
              Verore e Drejtorisë së Përgjithshme të Arkivave (DPA) rikthehet
              për një sezon të dytë plot buzëqeshje dhe kujtime!
            </p>
            <p>
              Në bashkëpunim me Arkivin Qendror të Filmit, këtë verë sjellim një
              cikël të dedikuar komedive shqiptare – filmave që na kanë bërë të
              qeshim, të mendojmë dhe që vazhdojnë të na shoqërojnë brez pas
              brezi.
            </p>
            <p>
              Nga batutat legjendare te situatat plot humor të hollë, këto filma
              janë pjesë e një trashëgimie kinematografike që mbart jo vetëm të
              qeshura, por edhe reflektime të kohës ku janë krijuar.
            </p>
            <p>
              Kinemaja Verore e DPA-së mbetet një hapësirë e gjallë kulturore,
              me 140 ulëse nën qiellin e hapur, që ofron një mënyrë të veçantë
              për të përjetuar filmin si bashkëbisedim mes brezave.
            </p>
            <p>
              Publiku është i ftuar të rizbulojë vlerat e humorit shqiptar, në
              një mjedis miqësor që ndërthur edukimin me zbavitjen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicComponent;
