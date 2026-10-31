package com.sjpt.mantrajaap;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Silences notifications (Android "Do Not Disturb", priority only) while the user chants,
 * and puts back whatever the phone was set to before. If the app goes to the background
 * or closes, the earlier setting is restored at once; it comes back on when chanting resumes.
 */
@CapacitorPlugin(name = "Dnd")
public class DndPlugin extends Plugin {
    private Integer previous = null; // the phone's filter before we changed it
    private boolean wanted = false;  // chanting screen is open and the user asked for silence

    private NotificationManager nm() {
        return (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
    }

    private boolean granted() {
        return nm().isNotificationPolicyAccessGranted();
    }

    private void silence() {
        NotificationManager n = nm();
        if (!granted()) return;
        if (previous == null) previous = n.getCurrentInterruptionFilter();
        n.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_PRIORITY);
    }

    private void restore() {
        NotificationManager n = nm();
        if (previous != null && granted()) n.setInterruptionFilter(previous);
        previous = null;
    }

    @PluginMethod
    public void status(PluginCall call) {
        JSObject r = new JSObject();
        r.put("granted", granted());
        call.resolve(r);
    }

    @PluginMethod
    public void openSettings(PluginCall call) {
        Intent i = new Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(i);
        call.resolve();
    }

    @PluginMethod
    public void enable(PluginCall call) {
        wanted = true;
        if (!granted()) { call.reject("Do Not Disturb access is not allowed", "NOT_GRANTED"); return; }
        silence();
        call.resolve();
    }

    @PluginMethod
    public void disable(PluginCall call) {
        wanted = false;
        restore();
        call.resolve();
    }

    @Override
    protected void handleOnPause() { restore(); }

    @Override
    protected void handleOnResume() { if (wanted) silence(); }

    @Override
    protected void handleOnDestroy() { wanted = false; restore(); }
}
