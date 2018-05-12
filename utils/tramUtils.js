const getVehicleInfo = (vehicleId) => {
  if (!vehicleId) return false;
  if (vehicleId.substr(0, 15) != '635218529567218') {
    console.log('Unknown vehicle, vehicleId=' + vehicleId);
    return false;
  }

  let id = parseInt(vehicleId.substr(15)) - 736;
  let prefix;
  let type;
  let low; // low floor: 0 = no, 1 - semi, 2 - full

  // Single exception - old id used in one case
  if (id == 831) {
    id = 216;
  }

  if (101 <= id && id <= 174) {
    prefix = 'HW';
    type = 'E1';
    low = 0;
    zaj = 'NH';

    if ((108 <= id && id <= 113) || id == 127 || id == 131 || id == 132 || id == 134 || (137 <= id && id <= 139) || (148 <= id && id <= 150) || (153 <= id && id <= 155)) {
      prefix = 'RW';
      zaj = 'PT';
    }
  } else if (201 <= id && id <= 293) {
    prefix = 'RZ';
    type = '105Na';
    low = 0;
    zaj = 'PT';

    if (246 <= id) {
      prefix = 'HZ';
      zaj = 'NH';
    }
    if (id == 290) {
      type = '105Nb';
    }
  } else if (301 <= id && id <= 328) {
    prefix = 'RF';
    type = 'GT8S';
    low = 0;
    zaj = 'PT';

    if (id == 313) {
      type = 'GT8C'
      low = 1;
    } else if (id == 323) {
      low = 1;
    }
  } else if (401 <= id && id <= 440) {
    prefix = 'HL';
    type = 'EU8N';
    low = 1;
    zaj = 'NH';
  } else if (451 <= id && id <= 462) {
    prefix = 'HK';
    type = 'N8S-NF';
    low = 1;
    zaj = 'NH';

    if ((451 <= id && id <= 456) || id == 462) {
      type = 'N8C-NF';
    }
  } else if (601 <= id && id <= 650) {
    prefix = 'RP';
    type = 'NGT6 (3)';
    low = 2;
    zaj = 'PT';

    if (id <= 613) {
      type = 'NGT6 (1)';
    } else if (id <= 626) {
      type = 'NGT6 (2)';
    }
  } else if (801 <= id && id <= 824) {
    prefix = 'RY';
    type = 'NGT8';
    low = 2;
    zaj = 'PT';
  } else if (id == 899) {
    prefix = 'RY';
    type = '126N';
    low = 2;
    zaj = 'PT';
  } else if (901 <= id && id <= 936) {
    prefix = 'RG';
    type = '2014N';
    low = 2;
    zaj = 'PT';

    if (915 <= id) {
      prefix = 'HG';
      zaj = 'NH';
    }
  } else if (id === 999) {
    prefix = 'HG';
    type = '405N-Kr';
    low = 1;
    zaj = 'NH';
  } else {
    console.log('Unknown vehicle, vehicleId=' + vehicleId + ', id=' + id);
    return false;
  }

  return {
    vehicleId: vehicleId,
    prefix: prefix,
    id: id,
    num: prefix + id,
    type: type,
    low: low,
    zaj: zaj,
  };
};

export default {
  getVehicleInfo
};