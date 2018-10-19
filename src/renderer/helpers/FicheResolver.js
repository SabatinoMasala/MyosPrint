import fs from 'fs';
import Dir from '@/helpers/Dir'

let FICHES = {
    classic: {
        c: require('@/printers/classic/c.json'),
        b: require('@/printers/classic/b.json'),
    },
    roll: {
        b: require('@/printers/roll/b.json'),
        c: require('@/printers/roll/c.json'),
        neck: require('@/printers/roll/neck.json'),
        mini_a: require('@/printers/roll/mini_a.json'),
        mini_b: require('@/printers/roll/mini_b.json'),
    },
    blackmark: {
        b: require('@/printers/blackmark/b.json'),
        c: require('@/printers/blackmark/c.json'),
        neck: require('@/printers/blackmark/neck.json'),
        mini_a: require('@/printers/blackmark/mini_a.json'),
        mini_b: require('@/printers/blackmark/mini_b.json'),
    }
};

export default {
    getFiche(type, name) {
        let file = false;
        if (type === 'roll') {
            file = Dir.getFichesRollDir() + '/' + name + '.json';
        } else if (type === 'blackmark') {
            file = Dir.getFichesBlackmarkDir() + '/' + name + '.json';
        } else {
            return this.getDefault(type, name);
        }
        if (fs.existsSync(file)) {
            let json = fs.readFileSync(file, 'utf-8');
            json = JSON.parse(json);
            if (json.blackmark && !json.blackmarks) {
                json.blackmarks = [json.blackmark];
            }
            if (!json.blackmarks) {
                json.blackmarks = [{
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 10
                }];
            }
            Object.keys(json.slots).forEach(slotType => {
                json.slots[slotType] = json.slots[slotType].map(slot => {
                    if (!slot.info_position) {
                        slot.info_position = 'bottom';
                    }
                    if (!slot.info_margin) {
                        slot.info_margin = 5;
                    }
                    return slot;
                });
            });
            return json;
        } else {
            return this.getDefault(type, name);
        }
    },
    getDefault(type, name) {
        return JSON.parse(JSON.stringify( FICHES[type][name] ));
    }
}
