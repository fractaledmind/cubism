require "kredis"

require "cubism/version"
require "cubism/engine"
require "cubism/broadcaster"
require "cubism/cubicle_block_store"

module Cubism
  extend ActiveSupport::Autoload

  autoload :Broadcaster, "cubism/broadcaster"

  mattr_accessor :user_class, instance_writer: false, instance_reader: false

  mattr_reader :store, instance_reader: false, default: Cubism::CubicleBlockStore.instance
end
