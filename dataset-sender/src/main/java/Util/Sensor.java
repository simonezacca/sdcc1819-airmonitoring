package Util;

import java.util.ArrayList;
import java.util.List;

public class Sensor {

    private long sensorid;
    /*private Double NO;
    private Double CO;
    private Double PM10;
    private Double BEN;
    private Double CH4;
    private Double EBE;
    private Double NMHC;
    private Double NO_2;
    private Double NOx;
    private Double O_3;
    private Double SO_2;
    private Double TCH;*/
    public List<AirAgent> values = new ArrayList<>();


    public Sensor(long sensorid) {
        this.sensorid = sensorid;
    }
/*
    @Override
    public String toString() {
        return "Sensor{" +
                "sensorID=" + sensorID +
                ", NO='" + NO + '\'' +
                ", CO='" + CO + '\'' +
                ", PM10='" + PM10 + '\'' +
                ", BEN='" + BEN + '\'' +
                ", CH4='" + CH4 + '\'' +
                ", EBE='" + EBE + '\'' +
                ", NMHC='" + NMHC + '\'' +
                ", NO_2='" + NO_2 + '\'' +
                ", NOx='" + NOx + '\'' +
                ", O_3='" + O_3 + '\'' +
                ", SO_2='" + SO_2 + '\'' +
                ", TCH='" + TCH + '\'' +
                '}';
    }*/

    public long getSensorid() {
        return sensorid;
    }

    public void setSensorid(long sensorid) {
        this.sensorid = sensorid;
    }

  /*  public void setNO(double NO) {
        this.NO = NO;
    }

    public void setCO(double CO) {
        this.CO = CO;
    }

    public void setPM10(double PM10) {
        this.PM10 = PM10;
    }

    public void setBEN(double BEN) {
        this.BEN = BEN;
    }

    public void setCH4(double CH4) {
        this.CH4 = CH4;
    }

    public void setEBE(double EBE) {
        this.EBE = EBE;
    }

    public void setNMHC(double NMHC) {
        this.NMHC = NMHC;
    }

    public void setNO_2(double NO_2) {
        this.NO_2 = NO_2;
    }

    public void setNOx(double NOx) {
        this.NOx = NOx;
    }

    public void setO_3(double o_3) {
        O_3 = o_3;
    }

    public void setSO_2(double SO_2) {
        this.SO_2 = SO_2;
    }

    public void setTCH(double TCH) {
        this.TCH = TCH;
    }*/
}