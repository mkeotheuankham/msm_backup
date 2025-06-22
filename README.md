# msm
ໂປຣແກຣມສ້າງແຜນທີ່ GIS  

/src    
  /api  
    ├── apiClient.js            # Axios instance ພື້ນຖານ  
    ├── mapService.js          # ບໍລິການຂໍ້ມູນແຜນທີ່   
    ├── endpointService.js    # ຈັດການ API endpoints 
    └── authService.js        # ການຈັດການ authentication 
    
  /components   
    /map    
      ├── MapView.jsx          # ສ່ວນສະແດງແຜນທີ່ຫຼັກ 
      ├── MapControls.jsx      # ປຸ່ມຄວບຄຸມແຜນທີ່    
      ├── MapLayers.jsx      # ການຈັດການ layer ຕ່າງໆ  
      └── MapMarkers.jsx        # ຈຸດ marker ໃສ່ແຜນທີ່  
    /ui 
      ├── Header.jsx            # ສ່ວນຫົວໜ້າ   
      ├── Sidebar.jsx          # ແຖບຂ້າງ 
      ├── EndpointSelector.jsx   # ເລືອກ API endpoint    
      └── LoadingSpinner.jsx     # ສະແດງສະຖານະກຳລັງໂຫຼດ    
  /context  
    ├── MapContext.js          # ຈັດການ state ແຜນທີ່   
    └── ApiContext.js          # ຈັດການ API configuration    
  /hooks    
    ├── useMap.js              # Custom hook ສຳລັບແຜນທີ່    
    └── useApi.js              # Custom hook ສຳລັບ API calls  
  /styles   
    ├── variables.css          # CSS variables  
    ├── global.css            # ຮູບແບບທົ່ວໄປ   
    ├── components.css        # ສຳລັບ components  
    └── map.css              # ສຳລັບສ່ວນແຜນທີ່   
  /utils    
    ├── constants.js            # ຄ່າຄົງທີ່ 
    ├── helpers.js            # ຟັງຊັນຊ່ອຍ 
    └── validation.js          # ກວດສອບຂໍ້ມູນ  
  /pages    
    └── MapPage.jsx          # ໜ້າແຜນທີ່ຫຼັກ 
  App.js    
  index.js  