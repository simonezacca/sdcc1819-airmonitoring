package Util;

import java.time.LocalDateTime;

public class Data {

    private LocalDateTime date;
    private double NO;
    private double CO;
    private double CO2;
    private double PM10;

    public Data(LocalDateTime date, double NO) {
        this.date = date;
        this.NO = NO;
    }

    public Data(LocalDateTime date, double NO, double CO, double CO2, double PM10) {
        this.date = date;
        this.NO = NO;
        this.CO = CO;
        this.CO2 = CO2;
        this.PM10 = PM10;
    }

    @Override
    public String toString() {
        return "Data{" +
                "date=" + date +
                ", NO=" + NO +
                '}';
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public double getNO() {
        return NO;
    }

    public void setNO(double NO) {
        this.NO = NO;
    }

    public double getCO() {
        return CO;
    }

    public void setCO(double CO) {
        this.CO = CO;
    }

    public double getCO2() {
        return CO2;
    }

    public void setCO2(double CO2) {
        this.CO2 = CO2;
    }

    public double getPM10() {
        return PM10;
    }

    public void setPM10(double PM10) {
        this.PM10 = PM10;
    }
}
