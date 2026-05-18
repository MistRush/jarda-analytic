# Integrace Tracy s IDE
Při zobrazení chybové stránky (případně některých Tracy panelů) lze kliknout na jména souborů a ty se otevřou ve vašem editoru s kurzorem na příslušné řádce.
Aby se tak stalo, je potřeba prohlížeč a systém nakonfigurovat.

_Kompletní nastavení naleznete v [oficiální dokumentaci Tracy](https://tracy.nette.org/cs/open-files-in-ide)._

- Instalace pro [Windows](#windows)
- Instalace pro [Linux](#linux)

## Windows
1. __Na disku vytvořte oba skripty.__ [Tracy repozitář se soubory](https://github.com/nette/tracy/tree/master/tools/open-in-editor/windows)
2. __Upravte nastavení v `open-editor.sh` tak, aby byly správně nastaveny cesty ke zvolenému IDE.__
   1. Jakožto výchozí editor je odkomentován PhpStorm, stačí mu tedy nastavit správnou cestu, případně zakomentovat a zvolit jiné IDE.
   2. Pokud používáte Docker/WSL, nastavte `mappings` v proměnné `settings` v `open-editor.sh`.
   3. _Mapování je připraveno pro Docker (`phpenv-v2`) spolu s WSL._
3. __Spusťte skript `install.cmd`__

### open-editor.js
```javascript
// KONFIGURACE

var settings = {
	// PhpStorm
	editor: '"C:\\Program Files\\JetBrains\\PhpStorm 2018.1.2\\bin\\phpstorm64.exe" --line %line% "%file%"',
	title: 'PhpStorm',

	// NetBeans
	// editor: '"C:\\Program Files\\NetBeans 8.1\\bin\\netbeans.exe" "%file%:%line%" --console suppress',

	// Nusphere PHPEd
	// editor: '"C:\\Program Files\\NuSphere\\PhpED\\phped.exe" "%file%" --line=%line%',

	// SciTE
	// editor: '"C:\\Program Files\\SciTE\\scite.exe" "-open:%file%" -goto:%line%',

	// EmEditor
	// editor: '"C:\\Program Files\\EmEditor\\EmEditor.exe" "%file%" /l %line%',

	// PSPad Editor
	// editor: '"C:\\Program Files\\PSPad editor\\PSPad.exe" -%line% "%file%"',

	// gVim
	// editor: '"C:\\Program Files\\Vim\\vim73\\gvim.exe" "%file%" +%line%',

	// Sublime Text 2
	// editor: '"C:\\Program Files\\Sublime Text 2\\sublime_text.exe" "%file%:%line%"',

	// Visual Studio Code / VSCodium
	// editor: '"C:\\Program Files\\Microsoft VS Code\\Code.exe" --goto "%file%:%line%"',

	mappings: {
		//'/var/www/remante': '\\\\wsl.localhost/Ubuntu/home/[UZIVATEL]/phpenv-v2/websites'
	}
};

// /KONFIGURACE


if (!settings.editor) {
    WScript.Echo('Create variable "settings.editor" in ' + WScript.ScriptFullName);
    WScript.Quit();
}

var url = WScript.Arguments(0);
var match = /^editor:\/\/(open|create|fix)\/?\?file=([^&]+)&line=(\d+)(?:&search=([^&]*)&replace=([^&]*))?/.exec(url);
if (!match) {
    WScript.Echo('Unexpected URI ' + url);
    WScript.Quit();
}
for (var i in match) {
    match[i] = decodeURIComponent(match[i]).replace(/\+/g, ' ');
}

var action = match[1];
var file = match[2];
var line = match[3];
var search = match[4];
var replace = match[5];

var shell = new ActiveXObject('WScript.Shell');
var fileSystem = new ActiveXObject('Scripting.FileSystemObject');

for (var id in settings.mappings) {
    if (file.indexOf(id) === 0) {
        file = settings.mappings[id] + file.substr(id.length);
        break;
    }
}

if (action === 'create' && !fileSystem.FileExists(file)) {
    shell.Run('cmd /c mkdir "' + fileSystem.GetParentFolderName(file) + '"', 0, 1);
    fileSystem.CreateTextFile(file).Write(replace);

} else if (action === 'fix') {
    var lines = fileSystem.OpenTextFile(file).ReadAll().split('\n');
    lines[line-1] = lines[line-1].replace(search, replace);
    fileSystem.OpenTextFile(file, 2).Write(lines.join('\n'));
}

var command = settings.editor.replace(/%line%/, line).replace(/%file%/, file);
shell.Exec(command);

if (settings.title) {
    shell.AppActivate(settings.title);
}
```

### install.cmd
```bash
@echo off
:: This Windows batch file sets open-editor.js as handler for editor:// protocol

if defined PROCESSOR_ARCHITEW6432 (set reg="%systemroot%\sysnative\reg.exe") else (set reg=reg)

%reg% ADD HKCR\editor /ve /d "URL:editor Protocol" /f
%reg% ADD HKCR\editor /v "URL Protocol" /d "" /f
%reg% ADD HKCR\editor\shell\open\command /ve /d "wscript \"%~dp0open-editor.js\" \"%%1\"" /f
%reg% ADD HKLM\SOFTWARE\Policies\Google\Chrome\URLWhitelist /v "123" /d "editor://*" /f
```

---
## Linux
1. __Oba skripty vytvořte v adresáři `~/bin`.__ [Tracy repozitář se soubory](https://github.com/nette/tracy/tree/master/tools/open-in-editor/linux)
2. __Nastavte open-editor.sh spustitelným `chmod +x ~/bin/open-editor.sh`__
   1. Kód je připravený pro PhpStorm, pokud pužíváte jiné IDE, upravte nastavení v `open-editor.sh`.
   2. Pokud používáte Docker, odkomentujte a nastavte `mapping` v `open-editor.sh`.
   3. _Mapování je připraveno pro Docker (`phpenv-v2`) spolu s WSL._
3. __Spusťte skript `install.sh`__

### open-editor.sh
```bash
#!/bin/bash
declare -A mapping

# KONFIGURACE

editor='phpstorm --line $LINE "$FILE"'
#mapping["/var/www/remante"]="/home/[UZIVATEL]/phpenv-v2/websites"

# /KONFIGURACE

#
# Configure your editor by setting the $editor variable:
#

# Visual Studio Code
#editor='code --goto "$FILE":"$LINE"'
# Emacs
#editor='emacs +$LINE "$FILE"'
# gVim
#editor='gvim +$LINE "$FILE"'
# gEdit
#editor='gedit +$LINE "$FILE"'
# Pluma
#editor='pluma +$LINE "$FILE"'
# PHPStorm
# To enable PHPStorm command-line interface, folow this guide: https://www.jetbrains.com/help/phpstorm/working-with-the-ide-features-from-command-line.html
#editor='phpstorm --line $LINE "$FILE"'
# VS Codium
#editor='codium --goto "$FILE":"$LINE"'
# Visual Studio Code
#editor='code --goto "$FILE":"$LINE"'

#
# Optionally configure custom mapping here:
#

#mapping["/remotepath"]="/localpath"
#mapping["/mnt/d/"]="d:/"

#
# Please, do not modify the code below.
#

# Find and return URI parameter value. Or nothing, if the param is missing.
# Arguments: 1) URI, 2) Parameter name.
function get_param {
	echo "$1" | sed -n -r "s/.*$2=([^&]*).*/\1/ip"
}

if [[ -z "$editor" ]]; then
	echo "You need to set the \$editor variable in file '`realpath $0`'"
	exit
fi

url=$1
if [ "${url:0:9}" != "editor://" ]; then
	exit
fi

# Parse action and essential data from the URI.
regex='editor\:\/\/(open|create|fix)\/?\?(.*)'
action=`echo $url | sed -r "s/$regex/\1/i"`
uri_params=`echo $url | sed -r "s/$regex/\2/i"`

file=`get_param $uri_params "file"`
line=`get_param $uri_params "line"`
search=`get_param $uri_params "search"`
replace=`get_param $uri_params "replace"`

# Debug?
#echo "action '$action'"
#echo "file '$file'"
#echo "line '$line'"
#echo "search '$search'"
#echo "replace '$replace'"

# Convert URI encoded codes to normal characters (e.g. '%2F' => '/').
printf -v file "${file//%/\\x}"
# And escape double-quotes.
file=${file//\"/\\\"}

# Apply custom mapping conversion.
for path in "${!mapping[@]}"; do
	file="${file//$path/${mapping[$path]}}"
done

# Action: Create a file (only if it does not already exist).
if [ "$action" == "create" ] && [[ ! -f "$file" ]]; then
	mkdir -p $(dirname "$file")
	touch "$file"
	echo $replace > "$file"
fi

# Action: Fix the file (if the file exists and while creating backup beforehand).
if [ "$action" == "fix" ]; then

	if [[ ! -f "$file" ]]; then
		echo "Cannot fix non-existing file '$file'"
		exit
	fi

	# Backup the original file.
	cp $file "$file.bak"
	# Search and replace in place - only on the specified line.
	sed -i "${line}s/${search}/${replace}/" $file

fi

# Format the command according to the selected editor.
command="${editor//\$FILE/$file}"
command="${command//\$LINE/$line}"

# Debug?
#echo $command

eval $command
```

### install.sh
```bash
#!/bin/bash

# This shell script sets open-editor.sh as handler for editor:// protocol

matches=0
while read -r line
do
	if [ "editor=" == "${line:0:7}" ]; then
		matches=1
		break
	fi
done < "open-editor.sh"

if [ "$matches" == "0" ]; then
	echo -e "\e[31;1mError: it seems like you have not set command to run your editor."
	echo -e "Before install, set variable \`\$editor\` in file \`open-editor.sh\`.\e[0m"
	exit 1
fi

# --------------------------------------------------------------

echo "[Desktop Entry]
Name=Tracy Open Editor
Exec=tracy-openeditor.sh %u
Terminal=false
NoDisplay=true
Type=Application
MimeType=x-scheme-handler/editor;" > tracy-openeditor.desktop

chmod +x open-editor.sh
chmod +x tracy-openeditor.desktop

sudo cp open-editor.sh /usr/bin/tracy-openeditor.sh
sudo xdg-desktop-menu install tracy-openeditor.desktop
sudo update-desktop-database
rm tracy-openeditor.desktop

echo -e "\e[32;1mDone.\e[0m"
```