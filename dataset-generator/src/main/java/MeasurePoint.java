public class MeasurePoint {

    String sampleTime;
    String station;
    String BEN;
    String CH4;
    String CO;
    String EBE;
    String NMHC;
    String NO;
    String NO_2;
    String NOx;
    String O_3;
    String PM10;

    @Override
    public String toString() {
        return "MeasurePoint{" +
                "sampleTime='" + sampleTime + '\'' +
                ", station='" + station + '\'' +
                ", BEN='" + BEN + '\'' +
                ", CH4='" + CH4 + '\'' +
                ", CO='" + CO + '\'' +
                ", EBE='" + EBE + '\'' +
                ", NMHC='" + NMHC + '\'' +
                ", NO='" + NO + '\'' +
                ", NO_2='" + NO_2 + '\'' +
                ", NOx='" + NOx + '\'' +
                ", O_3='" + O_3 + '\'' +
                ", PM10='" + PM10 + '\'' +
                ", PM25='" + PM25 + '\'' +
                ", SO_2='" + SO_2 + '\'' +
                ", TCH='" + TCH + '\'' +
                ", TOL='" + TOL + '\'' +
                '}';
    }

    String PM25;
    String SO_2;
    String TCH;
    String TOL;


    public MeasurePoint(String sampleTime, String BEN, String CH4, String CO,
                        String EBE, String NMHC, String NO, String NO_2, String NOx, String o_3,
                        String PM10, String PM25, String SO_2, String TCH, String TOL,String station)
    {
        this.sampleTime = sampleTime;
        this.station = station;
        this.BEN = BEN;
        this.CH4 = CH4;
        this.CO = CO;
        this.EBE = EBE;
        this.NMHC = NMHC;
        this.NO = NO;
        this.NO_2 = NO_2;
        this.NOx = NOx;
        this.O_3 = o_3;
        this.PM10 = PM10;
        this.PM25 = PM25;
        this.SO_2 = SO_2;
        this.TCH = TCH;
        this.TOL = TOL;
    }








}
