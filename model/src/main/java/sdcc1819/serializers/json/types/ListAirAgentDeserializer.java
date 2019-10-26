package sdcc1819.serializers.json.types;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import sdcc1819.model.AirAgent;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class ListAirAgentDeserializer implements JsonDeserializer<List<AirAgent>> {
    @Override
    public List<AirAgent> deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        JsonArray jsonArray = json.getAsJsonArray();

        Type listType = new TypeToken<List<AirAgent>>(){}.getType();
        List<AirAgent> yourClassList = new Gson().fromJson(jsonArray, listType);
        return yourClassList;
    }
}
