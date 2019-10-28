package operators.aggregate;

import org.apache.flink.api.common.functions.AggregateFunction;
import scala.Tuple1;
import scala.Tuple2;
import sdcc1819.model.Sensor;


// implementation of an aggregation function for an 'average'
public class ChemicalCompoundMean implements AggregateFunction<Sensor, AverageAccumulator, Double> {

    private String agentName;

    public ChemicalCompoundMean(String aname) {
        this.agentName = aname;
    }

    @Override
    public AverageAccumulator createAccumulator() {
        return new AverageAccumulator();
    }

    @Override
    public AverageAccumulator add(Sensor s, AverageAccumulator a) {
        a.sum += s.getAgentByName(this.agentName).getValue();
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