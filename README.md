# qb-menu
Menu System for the QBCore Framework

[![YouTube Subscribe](https://img.shields.io/badge/YouTube-Subscribe-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=LI-lh9IooYY)
[![Discord](https://img.shields.io/badge/Discord-Join-blue?style=for-the-badge&logo=discord)](https://discord.gg/EkwWvFS)
[![Tebex Store](https://img.shields.io/badge/Tebex-Store-green?style=for-the-badge&logo=shopify)](https://eyestore.tebex.io/)

![cyberpunk-menu](https://github.com/user-attachments/assets/2ea1d8ba-cd0a-45b0-b8ec-1cd47ddc20ec)

![cyberpunk-qb-menu](https://github.com/user-attachments/assets/830f5ef8-172e-48d6-8cf6-76472d1114ac)

This is a modified version of **[NH Context](https://forum.cfx.re/t/no-longer-supported-standalone-nerohiro-s-context-menu-dynamic-event-firing-menu/2564083)** by **[NeroHiro](https://github.com/nerohiro)**

--[[
EXAMPLE MENU
--]]

```
RegisterCommand("qbmenutest", function(source, args, raw)
    openMenu({
        {
            header = "Main Title",
            isMenuHeader = true, -- Set to true to make a nonclickable title
        },
        {
            header = "Sub Menu Button",
            txt = "This goes to a sub menu",
            params = {
                event = "qb-menu:client:testMenu2",
                args = {
                    number = 1,
                }
            }
        },
        {
            header = "Sub Menu Button",
            txt = "This goes to a sub menu",
            disabled = true,
            -- hidden = true, -- doesnt create this at all if set to true
            params = {
                event = "qb-menu:client:testMenu2",
                args = {
                    number = 1,
                }
            }
        },
    })
end)
```
```
RegisterNetEvent('qb-menu:client:testMenu2', function(data)
    local number = data.number
    openMenu({
        {
            header = "< Go Back",
        },
        {
            header = "Number: "..number,
            txt = "Other",
            params = {
                event = "qb-menu:client:testButton",
                args = {
                    message = "This was called by clicking this button"
                }
            }
        },
    })
end)
```
```
RegisterNetEvent('qb-menu:client:testButton', function(data)
    TriggerEvent('QBCore:Notify', data.message)
end)
```

# License

    QBCore Framework
    Copyright (C) 2021 Joshua Eger

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
