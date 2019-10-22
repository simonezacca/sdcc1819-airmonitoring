package Util;

public class Sensor {

    private long sensorID;
    private String NO;
    private String CO;
    private String PM10;
    private String BEN;
    private String CH4;
    private String EBE;
    private String NMHC;
    private String NO_2;
    private String NOx;
    private String O_3;
    private String SO_2;
    private String TCH;


    public Sensor(long sensorID) {
        this.sensorID = sensorID;
    }

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
    }

    public long getSensorID() {
        return sensorID;
    }

    public void setSensorID(long sensorID) {
        this.sensorID = sensorID;
    }

    public void setNO(String NO) {
        this.NO = NO;
    }

    public void setCO(String CO) {
        this.CO = CO;
    }

    public void setPM10(String PM10) {
        this.PM10 = PM10;
    }

    public void setBEN(String BEN) {
        this.BEN = BEN;
    }

    public void setCH4(String CH4) {
        this.CH4 = CH4;
    }

    public void setEBE(String EBE) {
        this.EBE = EBE;
    }

    public void setNMHC(String NMHC) {
        this.NMHC = NMHC;
    }

    public void setNO_2(String NO_2) {
        this.NO_2 = NO_2;
    }

    public void setNOx(String NOx) {
        this.NOx = NOx;
    }

    public void setO_3(String o_3) {
        O_3 = o_3;
    }

    public void setSO_2(String SO_2) {
        this.SO_2 = SO_2;
    }

    public void setTCH(String TCH) {
        this.TCH = TCH;
    }
}
