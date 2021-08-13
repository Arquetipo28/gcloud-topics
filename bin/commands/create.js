"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const yaml_1 = require("yaml");
exports.default = (argv) => {
    var _a;
    const configFile = fs_1.readFileSync(argv.path, 'utf-8');
    const config = yaml_1.parse(configFile);
    if (!((_a = config.topics) === null || _a === void 0 ? void 0 : _a.length))
        return;
    const baseCommand = "gcloud pubsub topics create";
    config.topics.forEach((topic) => {
        const optionalCommand = [''];
        if (topic.regions)
            optionalCommand.push(`--message-storage-policy-allowed-regions=${topic.regions.join(',')}`);
        if (topic.schema) {
            const { id, project, encoding } = topic.schema;
            const schemaId = `--schema=${id}`;
            const schemaProject = `--schema-project=${project || config.project}`;
            optionalCommand.push(`${schemaId} ${schemaProject}`);
            if (encoding) {
                const schemaEndcoding = `--message-encoding=${encoding}`;
                optionalCommand.push(schemaEndcoding);
            }
        }
        const fullCommand = `${baseCommand} ${topic.name} ${optionalCommand.join(' ')}`;
        console.log(fullCommand);
        child_process_1.exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    });
};
//# sourceMappingURL=create.js.map