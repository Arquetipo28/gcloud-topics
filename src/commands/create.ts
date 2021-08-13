import { exec } from "child_process"
import { readFileSync } from "fs"
import { parse } from "yaml"

export default (argv) => {
  const configFile: string = readFileSync(argv.path, 'utf-8')
  const config = parse(configFile)
  if (!config.topics?.length) return
  const baseCommand = "gcloud pubsub topics create"

  config.topics.forEach((topic: Topic) => {
    const optionalCommand: string[] = ['']
    if (topic.regions) optionalCommand.push(`--message-storage-policy-allowed-regions=${topic.regions.join(',')}`)
    if (topic.schema) {
      const { id, project, encoding } = topic.schema
      const schemaId = `--schema=${id}`
      const schemaProject = `--schema-project=${project || config.project}`
      optionalCommand.push(`${schemaId} ${schemaProject}`)
      if (encoding) {
        const schemaEndcoding = `--message-encoding=${encoding}`
        optionalCommand.push(schemaEndcoding)
      }
    }
    const fullCommand: string = `${baseCommand} ${topic.name} ${optionalCommand.join(' ')}`

    console.log(fullCommand)
    exec(fullCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    })
  });
}