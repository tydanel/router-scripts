/ip firewall filter
add action=jump chain=forward \
    comment=children-content-filter \
    jump-target=children-content-filter  \
    src-address-list=children-List \
    out-interface-list=WAN \
    place-before=0

add action=drop chain=children-content-filter \
    connection-mark=children-content-filter-Mark

/ip firewall mangle
add action=mark-connection chain=forward \
    src-address-list=children-List \
    dst-address-list=blocked-children-content-List \
    new-connection-mark=children-content-filter-Mark \
    passthrough=no


/ip firewall address-list 
# Block tiktok
add address=tiktok.com list=blocked-children-content-List
add address=v16a.tiktokcdn.com list=blocked-children-content-List
add address=log.tiktokv.com list=blocked-children-content-List


/system/script/add name="disable-children-filter-rules" source={
    /ip/firewall/filter/set [find comment ="children-content-filter"] disabled=yes
}

/system/script/add name="enable-children-filter-rules" source={
    /ip/firewall/filter/set [find comment ="children-content-filter"] disabled=no
}


/system scheduler
# Enable filter rules at 8am
add interval=1d name=enable-kids-filter-rules on-event="/system/script/run [find name=\"enable-children-filter-rules\"]" policy=\
    ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon\
    start-date=jan/03/2023 start-time=08:00:00

# Disable filter rules at 3pm
add interval=1d name=disable-kids-filter-rules on-event="/system/script/run [find name=\"disable-children-filter-rules\"]" policy=\
    ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon\
    start-date=jan/03/2023 start-time=15:00:00
