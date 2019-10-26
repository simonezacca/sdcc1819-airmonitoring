package operators.aggregate;

import org.apache.flink.api.common.functions.AggregateFunction;
import scala.Tuple1;
import scala.Tuple2;


// implementation of an aggregation function for an 'average'
public class Average implements AggregateFunction<Tuple1<Double>, AverageAccumulator, Double> {


    @Override
    public AverageAccumulator createAccumulator() {
        return new AverageAccumulator();
    }

    @Override
    public AverageAccumulator add(Tuple1<Double> t, AverageAccumulator a) {
        a.sum += t._1();
        a.count++;
        return a;
    }

    @Override
    public Double getResult(AverageAccumulator a) {
        return a.sum / (double) a.count;
    }

    @Override
    public AverageAccumulator merge(AverageAccumulator a, AverageAccumulator b) {
        a.count += b.count;
        a.sum += b.sum;
        return a;
    }
}