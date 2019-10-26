package sdcc1819.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AirAgent {

    protected String name;
    protected Double value;

    public AirAgent(String name, Double value) {
        this.name = name;
        this.value = value;
    }
}
