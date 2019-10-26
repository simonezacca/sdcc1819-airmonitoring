package sdcc1819.serializers.json;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import sdcc1819.model.AirAgent;
import sdcc1819.model.Data;
import sdcc1819.serializers.json.types.*;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AirDataJsonSerializer {

    //static Type airAgentListType = new TypeToken<List<AirAgent>>() {}.getType();
    //static JsonSerializer<List<AirAgent>> airagentserializer = new ListAirAgentSerializer();
    //static JsonDeserializer<List<AirAgent>> airagentdeserializer = new ListAirAgentDeserializer();

    static Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer())
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeDeserializer())

            //.registerTypeAdapter(airAgentListType, airagentserializer)
            //.registerTypeAdapter(airAgentListType, airagentdeserializer)
            //.registerTypeAdapter(AirAgent.class, new AirAgentSerializer())
            //.registerTypeAdapter(AirAgent.class, new AirAgentDeserializer())
            .create();

    public static List<String> serialize(Data data){
        List<String> result = new ArrayList<>();
        result.add(gson.toJson(data));
        return result;
    }

    public static Data deserialize(String rawJson) {
        return gson.fromJson(rawJson, Data.class);
    }

    public static void main(String[] args) {

        String rawTest = "{\"datetime\":\"2018-03-02T10:00:00\",\"sensing_group_id\":\"1\",\"measurements\":[{\"sensorid\":\"28079004\",\"values\":[{\"name\":\"NO\",\"value\":52.0},{\"name\":\"CO\",\"value\":0.6000000238418579},{\"name\":\"NO_2\",\"value\":79.0},{\"name\":\"NOx\",\"value\":158.0},{\"name\":\"SO_2\",\"value\":3.0}]},{\"sensorid\":\"28079008\",\"values\":[{\"name\":\"NO\",\"value\":50.0},{\"name\":\"CO\",\"value\":0.5},{\"name\":\"PM10\",\"value\":4.0},{\"name\":\"BEN\",\"value\":1.600000023841858},{\"name\":\"CH4\",\"value\":1.5800000429153442},{\"name\":\"EBE\",\"value\":0.4000000059604645},{\"name\":\"NMHC\",\"value\":0.07000000029802322},{\"name\":\"NO_2\",\"value\":85.0},{\"name\":\"NOx\",\"value\":162.0},{\"name\":\"O_3\",\"value\":18.0},{\"name\":\"SO_2\",\"value\":4.0},{\"name\":\"TCH\",\"value\":1.649999976158142}]},{\"sensorid\":\"28079011\",\"values\":[{\"name\":\"NO\",\"value\":76.0},{\"name\":\"BEN\",\"value\":1.5},{\"name\":\"EBE\",\"value\":0.30000001192092896},{\"name\":\"NO_2\",\"value\":102.0},{\"name\":\"NOx\",\"value\":218.0}]},{\"sensorid\":\"28079016\",\"values\":[{\"name\":\"NO\",\"value\":43.0},{\"name\":\"CO\",\"value\":0.5},{\"name\":\"NO_2\",\"value\":88.0},{\"name\":\"NOx\",\"value\":153.0},{\"name\":\"O_3\",\"value\":9.0}]},{\"sensorid\":\"28079017\",\"values\":[{\"name\":\"NO\",\"value\":12.0},{\"name\":\"NO_2\",\"value\":57.0},{\"name\":\"NOx\",\"value\":76.0},{\"name\":\"O_3\",\"value\":15.0},{\"name\":\"SO_2\",\"value\":2.0}]},{\"sensorid\":\"28079018\",\"values\":[{\"name\":\"NO\",\"value\":23.0},{\"name\":\"CO\",\"value\":0.5},{\"name\":\"PM10\",\"value\":15.0},{\"name\":\"BEN\",\"value\":0.800000011920929},{\"name\":\"EBE\",\"value\":0.4000000059604645},{\"name\":\"NO_2\",\"value\":67.0},{\"name\":\"NOx\",\"value\":103.0},{\"name\":\"O_3\",\"value\":17.0},{\"name\":\"SO_2\",\"value\":6.0}]},{\"sensorid\":\"28079024\",\"values\":[{\"name\":\"NO\",\"value\":15.0},{\"name\":\"CO\",\"value\":0.30000001192092896},{\"name\":\"PM10\",\"value\":9.0},{\"name\":\"BEN\",\"value\":1.0},{\"name\":\"CH4\",\"value\":1.2899999618530273},{\"name\":\"EBE\",\"value\":0.4000000059604645},{\"name\":\"NMHC\",\"value\":0.07000000029802322},{\"name\":\"NO_2\",\"value\":65.0},{\"name\":\"NOx\",\"value\":88.0},{\"name\":\"O_3\",\"value\":14.0},{\"name\":\"SO_2\",\"value\":4.0},{\"name\":\"TCH\",\"value\":1.3600000143051147}]},{\"sensorid\":\"28079027\",\"values\":[{\"name\":\"NO\",\"value\":25.0},{\"name\":\"NO_2\",\"value\":76.0},{\"name\":\"NOx\",\"value\":115.0},{\"name\":\"O_3\",\"value\":10.0}]},{\"sensorid\":\"28079035\",\"values\":[{\"name\":\"NO\",\"value\":31.0},{\"name\":\"CO\",\"value\":0.6000000238418579},{\"name\":\"NO_2\",\"value\":79.0},{\"name\":\"NOx\",\"value\":127.0},{\"name\":\"O_3\",\"value\":11.0},{\"name\":\"SO_2\",\"value\":4.0}]},{\"sensorid\":\"28079036\",\"values\":[{\"name\":\"NO\",\"value\":35.0},{\"name\":\"CO\",\"value\":0.5},{\"name\":\"PM10\",\"value\":19.0},{\"name\":\"NO_2\",\"value\":79.0},{\"name\":\"NOx\",\"value\":133.0},{\"name\":\"SO_2\",\"value\":9.0}]},{\"sensorid\":\"28079038\",\"values\":[{\"name\":\"NO\",\"value\":20.0},{\"name\":\"PM10\",\"value\":7.0},{\"name\":\"BEN\",\"value\":1.100000023841858},{\"name\":\"EBE\",\"value\":0.6000000238418579},{\"name\":\"NO_2\",\"value\":72.0},{\"name\":\"NOx\",\"value\":104.0},{\"name\":\"SO_2\",\"value\":3.0}]},{\"sensorid\":\"28079039\",\"values\":[{\"name\":\"NO\",\"value\":41.0},{\"name\":\"CO\",\"value\":0.5},{\"name\":\"NO_2\",\"value\":89.0},{\"name\":\"NOx\",\"value\":152.0},{\"name\":\"O_3\",\"value\":12.0}]},{\"sensorid\":\"28079040\",\"values\":[{\"name\":\"NO\",\"value\":25.0},{\"name\":\"PM10\",\"value\":14.0},{\"name\":\"NO_2\",\"value\":62.0},{\"name\":\"NOx\",\"value\":101.0},{\"name\":\"SO_2\",\"value\":3.0}]},{\"sensorid\":\"28079047\",\"values\":[{\"name\":\"NO\",\"value\":21.0},{\"name\":\"PM10\",\"value\":14.0},{\"name\":\"NO_2\",\"value\":68.0},{\"name\":\"NOx\",\"value\":101.0}]},{\"sensorid\":\"28079048\",\"values\":[{\"name\":\"NO\",\"value\":32.0},{\"name\":\"PM10\",\"value\":14.0},{\"name\":\"NO_2\",\"value\":81.0},{\"name\":\"NOx\",\"value\":129.0}]},{\"sensorid\":\"28079049\",\"values\":[{\"name\":\"NO\",\"value\":8.0},{\"name\":\"NO_2\",\"value\":65.0},{\"name\":\"NOx\",\"value\":77.0},{\"name\":\"O_3\",\"value\":17.0}]},{\"sensorid\":\"28079050\",\"values\":[{\"name\":\"NO\",\"value\":31.0},{\"name\":\"PM10\",\"value\":8.0},{\"name\":\"NO_2\",\"value\":75.0},{\"name\":\"NOx\",\"value\":122.0}]},{\"sensorid\":\"28079054\",\"values\":[{\"name\":\"NO\",\"value\":19.0},{\"name\":\"NO_2\",\"value\":64.0},{\"name\":\"NOx\",\"value\":93.0},{\"name\":\"O_3\",\"value\":26.0}]},{\"sensorid\":\"28079055\",\"values\":[{\"name\":\"NO\",\"value\":53.0},{\"name\":\"PM10\",\"value\":13.0},{\"name\":\"BEN\",\"value\":1.100000023841858},{\"name\":\"CH4\",\"value\":1.25},{\"name\":\"EBE\",\"value\":0.6000000238418579},{\"name\":\"NMHC\",\"value\":0.07999999821186066},{\"name\":\"NO_2\",\"value\":89.0},{\"name\":\"NOx\",\"value\":170.0},{\"name\":\"TCH\",\"value\":1.3200000524520874}]},{\"sensorid\":\"28079056\",\"values\":[{\"name\":\"NO\",\"value\":54.0},{\"name\":\"CO\",\"value\":0.4000000059604645},{\"name\":\"PM10\",\"value\":20.0},{\"name\":\"NO_2\",\"value\":82.0},{\"name\":\"NOx\",\"value\":164.0},{\"name\":\"O_3\",\"value\":16.0}]},{\"sensorid\":\"28079057\",\"values\":[{\"name\":\"NO\",\"value\":24.0},{\"name\":\"CO\",\"value\":0.5},{\"name\":\"PM10\",\"value\":12.0},{\"name\":\"NO_2\",\"value\":77.0},{\"name\":\"NOx\",\"value\":114.0},{\"name\":\"SO_2\",\"value\":7.0}]},{\"sensorid\":\"28079058\",\"values\":[{\"name\":\"NO\",\"value\":10.0},{\"name\":\"NO_2\",\"value\":17.0},{\"name\":\"NOx\",\"value\":33.0},{\"name\":\"O_3\",\"value\":20.0}]},{\"sensorid\":\"28079059\",\"values\":[{\"name\":\"NO\",\"value\":30.0},{\"name\":\"NO_2\",\"value\":73.0},{\"name\":\"NOx\",\"value\":120.0},{\"name\":\"O_3\",\"value\":9.0}]},{\"sensorid\":\"28079060\",\"values\":[{\"name\":\"NO\",\"value\":43.0},{\"name\":\"PM10\",\"value\":20.0},{\"name\":\"NO_2\",\"value\":90.0},{\"name\":\"NOx\",\"value\":156.0},{\"name\":\"O_3\",\"value\":13.0}]}]}";


        Data d = AirDataJsonSerializer.deserialize(rawTest);
        System.out.println(d.toString());
    }
}
