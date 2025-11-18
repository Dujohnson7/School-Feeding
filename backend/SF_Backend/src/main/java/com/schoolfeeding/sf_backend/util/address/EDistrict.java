package com.schoolfeeding.sf_backend.util.address;

public enum EDistrict {
        // Kigali City
        GASABO(EProvince.KIGALI),
        KICUKIRO(EProvince.KIGALI),
        NYARUGENGE(EProvince.KIGALI),

        // Northern Province
        GICUMBI(EProvince.NORTHERN),
        MUSANZE(EProvince.NORTHERN),
        GAKENKE(EProvince.NORTHERN),
        RULINDO(EProvince.NORTHERN),
        BURERA(EProvince.NORTHERN),

        // Southern Province
        HUYE(EProvince.SOUTHERN),
        GISAGARA(EProvince.SOUTHERN),
        NYANZA(EProvince.SOUTHERN),
        NYAMAGABE(EProvince.SOUTHERN),
        MUHANGA(EProvince.SOUTHERN),
        NYARUGURU(EProvince.SOUTHERN),
        KAMONYI(EProvince.SOUTHERN),
        RUHANGO(EProvince.SOUTHERN),

        // Eastern Province
        RWAMAGANA(EProvince.EASTERN),
        KAYONZA(EProvince.EASTERN),
        BUGESERA(EProvince.EASTERN),
        GATSIBO(EProvince.EASTERN),
        NGOMA(EProvince.EASTERN),
        KIREHE(EProvince.EASTERN),
        NYAGATARE(EProvince.EASTERN),

        // Western Province
        RUBAVU(EProvince.WESTERN),
        RUSIZI(EProvince.WESTERN),
        KARONGI(EProvince.WESTERN),
        RUTSIRO(EProvince.WESTERN),
        NGORORERO(EProvince.WESTERN),
        NYAMASHEKE(EProvince.WESTERN),
        NYABIHU(EProvince.WESTERN);



        private final EProvince province;

        EDistrict(EProvince province) {
            this.province = province;
        }

        public EProvince getProvince() {
            return province;
        }

    }
