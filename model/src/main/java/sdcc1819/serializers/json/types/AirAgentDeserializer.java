package sdcc1819.serializers.json.types;

import com.google.gson.*;
import sdcc1819.model.AirAgent;

import java.lang.reflect.Type;

public class AirAgentDeserializer implements JsonDeserializer<AirAgent>{
    @Override
    public AirAgent deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        AirAgent model = new AirAgent();
        JsonObject jo = json.getAsJsonObject();

        //model.setName();
        //model.setValue();

        return null;
    }
}
