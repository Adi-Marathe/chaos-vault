import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import './MobileNotSupported.css';

export default function MobileNotSupported() {
  return (
    <div className="mobile-not-supported">
      <div className="mobile-not-supported__content">
        <div className="mobile-not-supported__icon-wrapper">
          <Smartphone size={48} className="mobile-not-supported__icon-mobile" />
          <div className="mobile-not-supported__cross"></div>
        </div>
        <h1 className="mobile-not-supported__title">Not available on mobile</h1>
        <p className="mobile-not-supported__desc">
          Chaos Vault is optimized for tablet and desktop displays. 
          Please switch to a larger screen for the best experience.
        </p>
        <div className="mobile-not-supported__devices">
          <Monitor size={24} />
          <span className="mono">Web / Tablet Required</span>
        </div>
      </div>
    </div>
  );
}
