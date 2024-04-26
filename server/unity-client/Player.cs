// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.31
// 

using Colyseus.Schema;
using Action = System.Action;

public partial class Player : Schema {
	[Type(0, "string")]
	public string username = default(string);

	[Type(1, "string")]
	public string iconUrl = default(string);

	/*
	 * Support for individual property change callbacks below...
	 */

	protected event PropertyChangeHandler<string> __usernameChange;
	public Action OnUsernameChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.username));
		__usernameChange += __handler;
		if (__immediate && this.username != default(string)) { __handler(this.username, default(string)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(username));
			__usernameChange -= __handler;
		};
	}

	protected event PropertyChangeHandler<string> __iconUrlChange;
	public Action OnIconUrlChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
		if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
		__callbacks.AddPropertyCallback(nameof(this.iconUrl));
		__iconUrlChange += __handler;
		if (__immediate && this.iconUrl != default(string)) { __handler(this.iconUrl, default(string)); }
		return () => {
			__callbacks.RemovePropertyCallback(nameof(iconUrl));
			__iconUrlChange -= __handler;
		};
	}

	protected override void TriggerFieldChange(DataChange change) {
		switch (change.Field) {
			case nameof(username): __usernameChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
			case nameof(iconUrl): __iconUrlChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
			default: break;
		}
	}
}

