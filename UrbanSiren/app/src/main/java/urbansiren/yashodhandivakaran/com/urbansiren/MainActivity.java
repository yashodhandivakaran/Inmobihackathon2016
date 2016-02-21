package urbansiren.yashodhandivakaran.com.urbansiren;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import urbansiren.yashodhandivakaran.com.urbansiren.helper.UserPreferences;
import urbansiren.yashodhandivakaran.com.urbansiren.service.UserLocationService;

public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    private View saver;
    private View ambulance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        /*Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
*/
        saver = findViewById(R.id.saver);
        ambulance = findViewById(R.id.ambulance);

        saver.setOnClickListener(this);
        ambulance.setOnClickListener(this);

        TextView label = (TextView)findViewById(R.id.label);
        Typeface customFont = Typeface.createFromAsset(getAssets(),"fonts/FallingSky.otf");
        label.setTypeface(customFont);

        UserPreferences userPreferences = UserPreferences.getInstance(this);
        if(userPreferences.getBooleanValue(UserPreferences.USER_TYPE_SAVER,false)){
            Intent ambulanceTracking = new Intent(this,AmbulanceTrackingActivity.class);
            startActivity(ambulanceTracking);
        }else if(userPreferences.getBooleanValue(UserPreferences.USER_TYPE_AMBULANCE,false)){
            Intent ambulanceActivity = new Intent(this,MapActivity.class);
            startActivity(ambulanceActivity);
        }
    }

    @Override
    public void onClick(View v) {

        UserPreferences userPreferences = UserPreferences.getInstance(this);

        if(v.getId() == R.id.saver){
            Intent locationService = new Intent(this, UserLocationService.class);
            startService(locationService);

            userPreferences.setBoolean(UserPreferences.USER_TYPE_SAVER,true);

            Intent ambulanceTracking = new Intent(this,AmbulanceTrackingActivity.class);
            startActivity(ambulanceTracking);

            //Start saver screen

        }else if(v.getId() == R.id.ambulance){
            Intent ambulanceActivity = new Intent(this,MapActivity.class);
            userPreferences.setBoolean(UserPreferences.USER_TYPE_AMBULANCE,true);
            startActivity(ambulanceActivity);
        }

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
