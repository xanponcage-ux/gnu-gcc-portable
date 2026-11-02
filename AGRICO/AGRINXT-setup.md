# AGRINXT development setup

Set AGRINXT_DB_CONNECT_STRING to the office Oracle descriptor, or configure the EPATEST alias on the Node host. Set AGRINXT_UI_ORIGIN to the browser origin allowed by CORS. Deploy the UI at /agrigomes and proxy /agriapi/ to the API with the prefix stripped. REACT_APP_AGRINXT_API_URL overrides the same-origin API URL for local development.

For a fresh build from this repository, set REACT_APP_AGRINXT_LOGIN_KEY to the existing login encryption input from the office deployment. The office transfer preserves that input in the existing login implementation. Use REACT_APP_AGRICO_LOGO_URL for an internally hosted logo.

Run the transfer from the AGRICO folder. OfficeRoot contains Agrico_NODE and Agrico_UI.

```powershell
$office = Read-Host "Office Agrico folder"
.\Apply-AGRINXT-To-Office.ps1 -OfficeRoot $office -CheckOnly
.\Apply-AGRINXT-To-Office.ps1 -OfficeRoot $office
```
