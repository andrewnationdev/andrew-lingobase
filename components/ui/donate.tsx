import Script from 'next/script';
import React from 'react';

const BuyMeACoffeeWidget = () => {
  return (
    <Script
      data-name="BMC-Widget"
      data-cfasync="false"
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-id="andrewnation"
      data-description="Support me on Buy me a coffee!"
      data-message=""
      data-color="#40DCA5"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
      strategy="beforeInteractive"
    />
  );
};

export default BuyMeACoffeeWidget;