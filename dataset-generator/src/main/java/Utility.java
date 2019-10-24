import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class Utility {

    public double toDouble(String s)
    {
        return Double.parseDouble(s);
    }


    public String toString(double d)
    {
        return Double.toString(d);
    }



    public String addTimeToTimestamp(String originalData)
    {
        int timeToAdd = GeneratorConfiguration.TIMETOSIMULATE;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = format.parse(originalData);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE,timeToAdd);
        String formatted = format.format(calendar.getTime());
        //System.out.println("O = " + originalData);
        //System.out.println("F = " + formatted);

        return formatted;
    }


    public static ArrayList<Double> interpolate(double start, double end, int count) {
        if (count < 2) {
            throw new IllegalArgumentException("interpolate: illegal count!");
        }
        ArrayList<Double> array = new ArrayList<>();
        for (int i = 0; i <= count; ++ i) {
            array.add(start + i * (end - start) / count);
        }
        return array;
    }


    public static void main(String[] args) {
        Utility u = new Utility();
        //String formatted = u.addTimeToTimestamp("2018-03-01 13:00:00");
    }
}
