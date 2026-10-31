package com.sjpt.mantrajaap;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DndPlugin.class); // silence notifications while chanting
        super.onCreate(savedInstanceState);
    }
}
